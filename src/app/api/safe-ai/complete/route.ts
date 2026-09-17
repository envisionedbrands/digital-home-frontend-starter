import { NextRequest, NextResponse } from 'next/server';
import { signedCrmPost } from '@/lib/crm/backend';
import { checkRateLimit } from '@/lib/api/rate-limit';

/**
 * POST /api/safe-ai/complete — the AI Minimum Safety Standard (envisioned.me/safe-ai)
 * hands a finished check to the CRM.
 *
 * The page is served by a different Worker (founder-intelligence-home) that
 * holds no CRM credentials. This route lives on the old site's Worker, which
 * already signs requests to the CRM, so the browser posts here (same origin)
 * and the scoring is repeated server-side — a stage computed in the browser is
 * a stage anyone can edit before it is stored.
 *
 * Body: { email, answers: { [key]: 0|1|2 index }, session_id?, first_name?, website? (honeypot) }
 * GET returns { ready: true } so the page knows the endpoint exists before it
 * shows the email box.
 */

const QUESTIONS = [
  { key: 'authority', label: 'Agent authority', values: [2, 1, 0] },
  { key: 'money', label: 'Money + compute exposure', values: [2, 1, 0] },
  { key: 'data', label: 'Data access', values: [2, 1, 0] },
  { key: 'limits', label: 'Hard limits', values: [0, 1, 2] },
  { key: 'permissions', label: 'Permissions', values: [0, 1, 2] },
  { key: 'approval', label: 'Human approval', values: [0, 1, 2] },
  { key: 'monitoring', label: 'Monitoring', values: [0, 1, 2] },
  { key: 'breaker', label: 'Circuit breakers', values: [0, 1, 2] },
  { key: 'kill', label: 'Kill switch', values: [0, 1, 2] },
  { key: 'recovery', label: 'Recovery', values: [0, 1, 2] },
] as const;
// The order the page's own worst-case summary recommends starting in.
const FIRST_MOVE_ORDER = ['limits', 'permissions', 'monitoring', 'kill', 'approval', 'breaker', 'recovery', 'authority', 'money', 'data'];
const ASSESSMENT_KEY = 'safe-ai';
const ASSESSMENT_VERSION = '2026-09-16';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v: unknown, max = 200): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function score(answers: Record<string, unknown>) {
  const statuses: Record<string, number> = {};
  let raw = 0;
  for (const q of QUESTIONS) {
    const idx = answers[q.key];
    if (!Number.isInteger(idx) || (idx as number) < 0 || (idx as number) > 2) return null;
    const s = q.values[idx as number];
    statuses[q.key] = s;
    raw += s;
  }
  const stage = raw <= 5 ? 'Protected' : raw <= 12 ? 'Meaningful gaps' : 'High exposure';
  const stageSlug = raw <= 5 ? 'protected' : raw <= 12 ? 'gaps' : 'exposed';
  const label = (k: string) => QUESTIONS.find((q) => q.key === k)!.label;
  const attention = QUESTIONS.filter((q) => statuses[q.key] === 1).map((q) => q.label);
  const missing = QUESTIONS.filter((q) => statuses[q.key] === 2).map((q) => q.label);
  const firstMoveKey = FIRST_MOVE_ORDER.find((k) => statuses[k] > 0) || null;
  return {
    raw,
    protection: Math.round(((20 - raw) / 20) * 100),
    stage,
    stageSlug,
    statuses,
    attention,
    missing,
    firstMove: firstMoveKey ? label(firstMoveKey) : 'Nothing urgent',
    protectedCount: QUESTIONS.filter((q) => statuses[q.key] === 0).length,
  };
}
const list = (arr: string[]) => (arr.length ? arr.join(', ') : 'none');

const CORS = { 'Access-Control-Allow-Origin': 'https://www.envisioned.me', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET() {
  return NextResponse.json({ ready: Boolean(process.env.API_SECRET_KEY) }, { headers: { ...CORS, 'cache-control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, 'STRICT_LIMITER');
  if (limited) return limited;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400, headers: CORS });
  }
  // Honeypot: same field name the CRM uses, so a bot is caught twice.
  if (clean(body.website)) return NextResponse.json({ ok: true }, { headers: CORS });

  const email = clean(body.email, 254).toLowerCase();
  if (!EMAIL.test(email)) return NextResponse.json({ error: 'A valid email is needed' }, { status: 400, headers: CORS });
  const firstName = clean(body.first_name, 80);
  const answers = body.answers && typeof body.answers === 'object' ? (body.answers as Record<string, unknown>) : null;
  const result = answers && score(answers);
  if (!result) return NextResponse.json({ error: 'Answer all ten questions first' }, { status: 400, headers: CORS });
  const sessionId = clean(body.session_id, 100) || crypto.randomUUID();
  const completedAt = new Date().toISOString();

  const payload = {
    email,
    ...(firstName ? { first_name: firstName } : {}),
    source: ASSESSMENT_KEY,
    page: '/safe-ai/',
    form: 'safe-ai-results',
    tags: ['safe-ai-completed', `safe-ai-stage-${result.stageSlug}`],
    custom: {
      safe_ai_score: String(result.raw),
      safe_ai_protection: String(result.protection),
      safe_ai_stage: result.stage,
      safe_ai_protected_count: String(result.protectedCount),
      safe_ai_attention: list(result.attention),
      safe_ai_missing: list(result.missing),
      safe_ai_first_move: result.firstMove,
      safe_ai_version: ASSESSMENT_VERSION,
      safe_ai_completed_at: completedAt,
    },
    assessment: {
      assessment_key: ASSESSMENT_KEY,
      version: ASSESSMENT_VERSION,
      session_id: sessionId,
      raw_score: result.raw,
      normalized_score: result.protection,
      maturity_stage: result.stageSlug,
      dimension_scores: result.statuses,
      answers,
      marketing_consent: true,
      page_url: 'https://www.envisioned.me/safe-ai/',
      referrer: request.headers.get('referer') || null,
      completed_at: completedAt,
    },
  };

  try {
    const res = await signedCrmPost('/api/crm/capture', payload);
    if (!res.ok) {
      console.error('safe-ai capture failed', res.status, (await res.text().catch(() => '')).slice(0, 300));
      return NextResponse.json({ error: 'Could not send right now' }, { status: 502, headers: CORS });
    }
    return NextResponse.json({ ok: true, stage: result.stage }, { headers: CORS });
  } catch (e) {
    console.error('safe-ai capture error', e);
    return NextResponse.json({ error: 'Could not send right now' }, { status: 502, headers: CORS });
  }
}
