import { NextRequest, NextResponse } from 'next/server';
import {
  APPLICATIONS,
  ASSESSMENT_KEY,
  ASSESSMENT_VERSION,
  BUILD_MODES,
  BUSINESS_CONTEXTS,
  calculateAssessment,
  getDimension,
  recommendOffer,
  type Answers,
  type Qualification,
} from '@/lib/assessment/founder-access';
import { signedCrmPost } from '@/lib/crm/backend';
import { checkRateLimit } from "@/lib/api/rate-limit";

/**
 * The scoring runs here, on the server, not in the browser. The client posts
 * raw answer indices and gets a stage back — it never computes the result it
 * displays. That matters for one reason: `assessment_completions` is funnel
 * intelligence, and a stage derived in the browser is a stage anyone can edit
 * before it is stored. The same call does the maths, writes the row and
 * returns the page content, so all three can never disagree.
 */

/* Allowed values are derived from the question definitions rather than retyped,
 * so adding a routing option in one place cannot fail validation in another. */
const APPLICATION_VALUES = new Set<string>(APPLICATIONS.map((option) => option.value));
const BUILD_MODE_VALUES = new Set<string>(BUILD_MODES.map((option) => option.value));
const BUSINESS_CONTEXT_VALUES = new Set<string>(BUSINESS_CONTEXTS.map((option) => option.value));

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const clean = (value: unknown, max = 200): string =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

function parseQualification(raw: unknown): Qualification | null {
  if (!raw || typeof raw !== 'object') return null;
  const value = raw as Record<string, unknown>;

  const highestValueApplication = clean(value.highest_value_application, 40);
  const preferredBuildMode = clean(value.preferred_build_mode, 40);
  const businessContext = clean(value.business_context, 40);

  if (
    !APPLICATION_VALUES.has(highestValueApplication) ||
    !BUILD_MODE_VALUES.has(preferredBuildMode) ||
    !BUSINESS_CONTEXT_VALUES.has(businessContext)
  ) {
    return null;
  }

  return {
    highest_value_application: highestValueApplication,
    preferred_build_mode: preferredBuildMode,
    business_context: businessContext,
  } as Qualification;
}

export async function POST(request: NextRequest) {
  // Public, anonymous, writes to the database — throttle before doing anything.
  const limited = await checkRateLimit(request, "STRICT_LIMITER");
  if (limited) return limited;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
  }

  // Honeypot: a hidden field only a bot fills in. Answer 200 so the bot has no
  // signal that it was caught, and write nothing. The name `website` is not
  // arbitrary — the backend capture route uses the same field for the same
  // purpose, so a bot that gets past here is caught again downstream. The
  // founder's real website is `profileUrl`.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const email = clean(body.email, 254).toLowerCase();
  const name = clean(body.name, 120);
  const company = clean(body.company, 160);
  const profileUrl = clean(body.profileUrl, 300);
  const sessionId = clean(body.sessionId, 100);
  const qualification = parseQualification(body.qualification);
  const answers = body.answers && typeof body.answers === 'object' ? (body.answers as Answers) : {};

  if (!EMAIL.test(email) || !name || !sessionId || !qualification) {
    return NextResponse.json({ error: 'Please complete every required field' }, { status: 400 });
  }

  let result;
  try {
    result = calculateAssessment(answers);
  } catch {
    return NextResponse.json({ error: 'The assessment answers are incomplete' }, { status: 400 });
  }

  const offer = recommendOffer(result, qualification);
  const constraint = getDimension(result.primaryConstraint);
  const marketingConsent = body.marketingConsent === true;
  const completedAt = new Date().toISOString();

  const tags = [
    'founder-access-completed',
    `stage-${result.stage.toLowerCase()}`,
    `constraint-${result.primaryConstraint.replaceAll('_', '-')}`,
    `fit-${offer.fit}`,
    `offer-${offer.id.replaceAll('_', '-')}`,
    `build-mode-${qualification.preferred_build_mode.replaceAll('_', '-')}`,
  ];
  if (marketingConsent) tags.push('marketing-consent');

  const d = result.dimensionScores;

  const crmPayload = {
    email,
    name,
    company: company || undefined,
    source: ASSESSMENT_KEY,
    page: '/founder-access',
    form: 'founder-access-complete',
    tags,
    custom: {
      quiz_summary: `${result.stage} (${result.score}/100). Constraint: ${constraint.name}. Recommended: ${offer.name}.`,
      assessment_version: ASSESSMENT_VERSION,
      ...(profileUrl ? { website: profileUrl } : {}),

      /* The eleven automation fields, named exactly as the brief names them.
       * These are what an email sequence branches on — do not rename without
       * updating the sequences that read them. */
      assessment_stage: result.stage,
      primary_constraint: result.primaryConstraint,
      ip_score: d.ip_strength,
      judgement_score: d.judgement_articulation,
      transferability_score: d.transferability,
      machine_readiness_score: d.machine_readiness,
      activation_governance_score: d.activation_governance,
      highest_value_application: qualification.highest_value_application,
      preferred_build_mode: qualification.preferred_build_mode,
      business_context: qualification.business_context,
      recommended_offer: offer.id,

      /* Migration 201 defined these `founder_access_*` custom fields, so the
       * CRM lead screen already has columns for them. Kept populated so those
       * columns do not silently go blank at v2.
       * `founder_access_priority` holds the constraint (v1 called it priority);
       * `founder_access_delivery_preference` has no v2 source and is dropped. */
      founder_access_score: result.score,
      founder_access_stage: result.stage,
      founder_access_priority: result.primaryConstraint,
      founder_access_fit: offer.fit,
      founder_access_completed_at: completedAt,

      ...(marketingConsent
        ? {
            marketing_consent: true,
            marketing_consent_source: ASSESSMENT_KEY,
            marketing_consent_at: completedAt,
          }
        : {}),
    },
    assessment: {
      assessment_key: ASSESSMENT_KEY,
      version: ASSESSMENT_VERSION,
      session_id: sessionId,
      raw_score: result.rawScore,
      normalized_score: result.score,
      maturity_stage: result.stage,
      dimension_scores: result.dimensionScores,
      answers,
      commercial_fit: offer.fit,
      qualification,
      marketing_consent: marketingConsent,
      page_url: clean(body.pageUrl, 500) || '/founder-access',
      referrer: clean(body.referrer, 500) || null,
      completed_at: completedAt,
    },
  };

  try {
    const response = await signedCrmPost('/api/crm/capture', crmPayload);
    if (!response.ok) {
      console.error('[founder-access] CRM capture failed', response.status, await response.text());
      return NextResponse.json(
        { error: 'We could not save your result. Please try again.' },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('[founder-access] CRM connection failed', error);
    return NextResponse.json(
      { error: 'We could not save your result. Please try again.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, result, offer });
}
