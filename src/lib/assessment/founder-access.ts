/**
 * The Founder Intelligence Assessment
 * "How Much of Your Business Still Depends on You?"
 *
 * v2 replaces the v1 pilot (7 dimensions, 21 statements, 1–5 agreement scale,
 * flat average). The difference that matters is not the shorter length — it is
 * that v2 is *gated*. v1 averaged everything, so a founder with almost no
 * captured IP could still land at "Transferable" by scoring well on AI
 * readiness. That produces a flattering number and a wrong recommendation.
 * Here the stage rules run in order and stop at the first failure, so weakness
 * in IP or judgement cannot be compensated for by anything downstream.
 *
 * `ASSESSMENT_KEY` stays 'founder-access' on purpose: migration 201 already
 * created `founder_access_*` CRM custom fields and tags against that key, and
 * `assessment_completions` is uniquely indexed on (assessment_key, session_id).
 * The public URL is marketing; the key is data. Only the version moves.
 */

export const ASSESSMENT_KEY = 'founder-access';
export const ASSESSMENT_VERSION = 'founder-intelligence-v2';

export const ASSESSMENT_TITLE = 'How Much of Your Business Still Depends on You?';
export const ASSESSMENT_LABEL = 'The Founder Intelligence Assessment';

/* ── Dimensions ──────────────────────────────────────────────────────────── */

export const DIMENSIONS = [
  {
    id: 'ip_strength',
    name: 'IP strength',
    question: 'Is there a real method underneath the results?',
  },
  {
    id: 'judgement_articulation',
    name: 'Judgement articulation',
    question: 'Can you say out loud what you decide by instinct?',
  },
  {
    id: 'transferability',
    name: 'Transferability',
    question: 'Can somebody else hold the standard without you?',
  },
  {
    id: 'machine_readiness',
    name: 'Machine readiness',
    question: 'Can a machine use your thinking without inventing the gaps?',
  },
  {
    id: 'activation_governance',
    name: 'Activation and governance',
    question: 'Is it doing real work, and does it stay current?',
  },
] as const;

export type DimensionId = (typeof DIMENSIONS)[number]['id'];
export type Answers = Record<string, number>;

export function getDimension(id: DimensionId) {
  return DIMENSIONS.find((dimension) => dimension.id === id)!;
}

/* ── Diagnostic questions (1–10) ─────────────────────────────────────────── */
/**
 * Option order IS the score: index 0 scores 0, index 4 scores 4. Never reorder
 * an options array without renumbering — the answers are stored raw in
 * `assessment_completions.answers`, so a reorder silently rewrites the meaning
 * of every result already collected.
 */

export interface DiagnosticQuestion {
  id: string;
  dimension: DimensionId;
  facet: string;
  question: string;
  options: readonly string[];
}

export const DIAGNOSTIC_QUESTIONS: readonly DiagnosticQuestion[] = [
  {
    id: 'ip_1',
    dimension: 'ip_strength',
    facet: 'Proof',
    question: 'How consistently has your methodology produced a recognisable result?',
    options: [
      'I am still discovering what reliably works',
      'It works mainly when I personally deliver it',
      'I have repeated results, but the method is mostly implicit',
      'I have repeated results and can name the core method',
      'It has worked across clients or contexts, with clear boundaries',
    ],
  },
  {
    id: 'ip_2',
    dimension: 'ip_strength',
    facet: 'Source material',
    question: 'Where does the substance of your method live today?',
    options: [
      'Mostly in my head and live conversations',
      'Across notes, recordings, messages and memory',
      'In several useful documents, but without one structure',
      'In an organised body of source material',
      'In a maintained source of truth with clear ownership',
    ],
  },
  {
    id: 'ja_1',
    dimension: 'judgement_articulation',
    facet: 'Rules',
    question: 'If someone applies your method incorrectly, can you point to the rule they missed?',
    options: [
      'No — I know it when I see it',
      'I can usually explain it after the mistake',
      'I have informal guidance for the common mistakes',
      'The main criteria and decision rules are documented',
      'Rules, examples, boundaries and escalation cases are explicit',
    ],
  },
  {
    id: 'ja_2',
    dimension: 'judgement_articulation',
    facet: 'Exceptions',
    question: 'Where are the exceptions, trade-offs and "it depends" decisions captured?',
    options: [
      'They are not captured',
      'They surface only when someone asks me',
      'Some are scattered through calls or notes',
      'The common exceptions are organised by context',
      'They are encoded as usable decision logic with examples',
    ],
  },
  {
    id: 'tr_1',
    dimension: 'transferability',
    facet: 'Quality control',
    question: 'Can someone else review work using your standards without waiting for your sign-off?',
    options: [
      'No — quality still depends on my eye',
      'They can check basics, but I make the real call',
      'They can handle familiar cases with my guidance',
      'They can review most work against defined standards',
      'They can decide, document exceptions and escalate only true edge cases',
    ],
  },
  {
    id: 'tr_2',
    dimension: 'transferability',
    facet: 'Founder absence',
    question: 'What happens to delivery when you step away for two weeks?',
    options: [
      'Core delivery stops',
      'It continues, but decisions pile up for me',
      'Routine work continues; complex work waits',
      'Most delivery continues with occasional escalation',
      'The system carries the method and records what needs my judgement',
    ],
  },
  {
    id: 'mr_1',
    dimension: 'machine_readiness',
    facet: 'AI output',
    question: 'What happens when AI works from your current materials?',
    options: [
      'I have not tested it meaningfully',
      'It produces generic output that needs heavy correction',
      'It sounds closer to me, but misses important judgement',
      'It follows core principles in familiar situations',
      'It applies source hierarchy, decision rules and boundaries reliably',
    ],
  },
  {
    id: 'mr_2',
    dimension: 'machine_readiness',
    facet: 'Authority',
    question: 'If two pieces of your source material conflict, does the system know which one wins?',
    options: [
      'No — conflicts are invisible',
      'I resolve conflicts manually each time',
      'There is an informal sense of which source is current',
      'Priority and current versions are documented',
      'The system can resolve or escalate conflicts through explicit governance',
    ],
  },
  {
    id: 'ag_1',
    dimension: 'activation_governance',
    facet: 'Workflow',
    question: 'Is your intelligence already doing work inside a real business workflow?',
    options: [
      'No — it is not yet operational',
      'Only through occasional prompts or manual reference',
      'One workflow uses parts of it inconsistently',
      'At least one workflow uses it repeatedly with clear inputs and outputs',
      'Multiple workflows use it with ownership, feedback and quality checks',
    ],
  },
  {
    id: 'ag_2',
    dimension: 'activation_governance',
    facet: 'Maintenance',
    question: 'When your methodology changes, how does the system get updated?',
    options: [
      'It does not — knowledge stays in my head',
      'I update things reactively when something breaks',
      'I revise key documents, but not every downstream use',
      'Changes flow through a defined source and update process',
      'Governance, review cycles, versions and adoption are actively managed',
    ],
  },
];

/* ── Routing questions (11–13) ───────────────────────────────────────────── */
/** These never touch the maturity score. They decide the offer and the sequence. */

export const APPLICATIONS = [
  { value: 'team_operations', label: 'Team decisions and operations' },
  { value: 'content_visibility', label: 'Content and visibility' },
  { value: 'sales_conversion', label: 'Sales and conversion' },
  { value: 'client_delivery', label: 'Client delivery' },
  { value: 'licensing_transfer', label: 'Licensing or transfer' },
] as const;

export const BUILD_MODES = [
  { value: 'diagnose', label: 'Diagnose and prioritise what to build' },
  { value: 'guided_build', label: 'Build it with expert guidance' },
  { value: 'built_for_me', label: 'Have the architecture built for me' },
] as const;

export const BUSINESS_CONTEXTS = [
  { value: 'programme', label: 'Established group programme, membership or certification' },
  { value: 'team_service', label: 'Team-based service business' },
  { value: 'solo_at_capacity', label: 'One-to-one practice at capacity' },
  { value: 'early_stage', label: 'Earlier-stage or still proving the method' },
] as const;

export const ROUTING_QUESTIONS = [
  {
    id: 'highest_value_application',
    question: 'Where would your intelligence create the most value first?',
    options: APPLICATIONS,
  },
  {
    id: 'preferred_build_mode',
    question: 'What kind of help would suit you best right now?',
    options: BUILD_MODES,
  },
  {
    id: 'business_context',
    question: 'Which business context is closest to yours?',
    options: BUSINESS_CONTEXTS,
  },
] as const;

export type ApplicationId = (typeof APPLICATIONS)[number]['value'];
export type BuildModeId = (typeof BUILD_MODES)[number]['value'];
export type BusinessContextId = (typeof BUSINESS_CONTEXTS)[number]['value'];

export interface Qualification {
  highest_value_application: ApplicationId;
  preferred_build_mode: BuildModeId;
  business_context: BusinessContextId;
}

export const TOTAL_QUESTIONS = DIAGNOSTIC_QUESTIONS.length + ROUTING_QUESTIONS.length; // 13

/* ── Maturity stages ─────────────────────────────────────────────────────── */

export type MaturityStage =
  | 'Founder-held'
  | 'Documented'
  | 'Structured'
  | 'Transferable'
  | 'Codified';

export const STAGE_COPY: Record<MaturityStage, { headline: string; explanation: string }> = {
  'Founder-held': {
    headline: 'The method is real. It just has nowhere to live except you.',
    explanation:
      'What you know is producing results, but it exists as instinct, conversation and availability. Nothing is wrong with the thinking. There is simply no version of it outside your own head, which means every increase in demand becomes an increase in you.',
  },
  Documented: {
    headline: 'You have written down what you do. Not yet how you decide.',
    explanation:
      'The steps exist somewhere. The judgement does not. That is why documentation has not reduced the questions coming back to you: people can follow your process and still not know what you would have chosen, or what "good enough" means when the situation is unusual.',
  },
  Structured: {
    headline: 'The knowledge is organised. Applying it still runs through you.',
    explanation:
      'You are past scattered files. There is a shape to what you know. What has not happened yet is transfer — the point where somebody else can hold the standard, make the call, and be right without checking.',
  },
  Transferable: {
    headline: 'Your thinking travels. It is not yet governed.',
    explanation:
      'People can use meaningful parts of your judgement without you in the room. What is missing is the layer that keeps it true: which source wins when two disagree, where it is actually deployed, and how it gets updated when you change your mind.',
  },
  Codified: {
    headline: 'Your intelligence is an asset. The question is what you do with it.',
    explanation:
      'Your judgement operates across delivery, decisions and machines without requiring direct access to you. From here the work stops being capture and starts being leverage: where to deploy it next, and what it could become commercially.',
  },
};

/* ── Scoring ─────────────────────────────────────────────────────────────── */

export type DimensionScores = Record<DimensionId, number>;

export interface AssessmentResult {
  /** Sum of the ten diagnostic answers, 0–40. */
  rawScore: number;
  /** rawScore as a percentage, 0–100. Stored, but never the headline. */
  score: number;
  /** Per-dimension average on the native 0–4 scale, one decimal. */
  dimensionScores: DimensionScores;
  stage: MaturityStage;
  primaryConstraint: DimensionId;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Stage rules run in order and return on the first failure. This is the whole
 * point of the model: a founder cannot buy their way past weak IP with a good
 * AI stack. Thresholds sit on the 0–4 dimension average, not the percentage.
 */
function deriveStage(d: DimensionScores): MaturityStage {
  if (d.ip_strength < 1.5) return 'Founder-held';
  if (d.judgement_articulation < 2.0) return 'Documented';
  if (d.transferability < 2.5) return 'Structured';
  if (d.machine_readiness < 2.5 || d.activation_governance < 2.3) return 'Transferable';
  return 'Codified';
}

/**
 * The constraint is the gate they failed, not simply their worst score — those
 * differ, and the gate is the more useful thing to tell someone. Only at
 * Codified, where no gate failed, does it fall back to the lowest dimension.
 */
function deriveConstraint(stage: MaturityStage, d: DimensionScores): DimensionId {
  switch (stage) {
    case 'Founder-held':
      return 'ip_strength';
    case 'Documented':
      return 'judgement_articulation';
    case 'Structured':
      return 'transferability';
    case 'Transferable':
      return d.machine_readiness <= d.activation_governance
        ? 'machine_readiness'
        : 'activation_governance';
    case 'Codified':
      return [...DIMENSIONS].sort((a, b) => d[a.id] - d[b.id])[0].id;
  }
}

export function calculateAssessment(answers: Answers): AssessmentResult {
  for (const question of DIAGNOSTIC_QUESTIONS) {
    const value = answers[question.id];
    if (!Number.isInteger(value) || value < 0 || value > 4) {
      throw new Error(`Invalid or missing answer: ${question.id}`);
    }
  }

  const rawScore = DIAGNOSTIC_QUESTIONS.reduce((total, q) => total + answers[q.id], 0);

  const dimensionScores = Object.fromEntries(
    DIMENSIONS.map((dimension) => {
      const questions = DIAGNOSTIC_QUESTIONS.filter((q) => q.dimension === dimension.id);
      const sum = questions.reduce((total, q) => total + answers[q.id], 0);
      return [dimension.id, round1(sum / questions.length)];
    })
  ) as DimensionScores;

  const stage = deriveStage(dimensionScores);

  return {
    rawScore,
    score: Math.round((rawScore / (DIAGNOSTIC_QUESTIONS.length * 4)) * 100),
    dimensionScores,
    stage,
    primaryConstraint: deriveConstraint(stage, dimensionScores),
  };
}

/* ── Offer routing ───────────────────────────────────────────────────────── */

export type CommercialFit = 'high' | 'developing' | 'nurture';

export interface OfferRecommendation {
  id: string;
  name: string;
  price: string;
  why: string;
  ctaLabel: string;
  ctaHref: string;
  fit: CommercialFit;
}

/**
 * Prices are business facts with a single source of truth in
 * 00-STRATEGY/DECISIONS.md — not values to be inferred from a brief. One
 * conflict is flagged rather than silently resolved:
 *
 *   The Atelier. The recreation brief says "From €1,999". DECISIONS #005
 *   (2026-07-22/23) raised it to €2,499 and explicitly supersedes the €1,999
 *   founder's rate. The locked decision wins here. If the €1,999 in the brief
 *   was deliberate — a returning founder's rate, say — this one line is the
 *   only edit needed.
 */
const OFFERS = {
  nurture: {
    id: 'nurture',
    name: 'Build the evidence before you buy the build',
    price: 'Nurture first',
    ctaLabel: 'Read the essays',
    ctaHref: '/blog?source=founder-access',
    fit: 'nurture' as CommercialFit,
  },
  integration_map: {
    id: 'integration_map',
    name: 'The Integration Map',
    price: '€1,500',
    ctaLabel: 'Book the Integration Map',
    ctaHref: '/book?offer=integration-map&source=founder-access',
    fit: 'developing' as CommercialFit,
  },
  embedded_genius: {
    id: 'embedded_genius',
    name: 'Embedded Genius',
    price: 'From €12,000',
    ctaLabel: 'Start the conversation',
    ctaHref: '/contact?interest=embedded-genius&source=founder-access',
    fit: 'high' as CommercialFit,
  },
  atelier: {
    id: 'atelier',
    name: 'The Atelier',
    price: 'From €2,499',
    ctaLabel: 'See the next cohort',
    ctaHref: '/contact?interest=atelier&source=founder-access',
    fit: 'developing' as CommercialFit,
  },
  residency: {
    id: 'residency',
    name: 'The Residency',
    price: 'From €1,250 per month',
    ctaLabel: 'Talk about what is next',
    ctaHref: '/contact?interest=residency&source=founder-access',
    fit: 'high' as CommercialFit,
  },
  citc: {
    id: 'citc',
    name: 'Codified in the City',
    price: '€5,500',
    ctaLabel: 'Apply for a place',
    ctaHref: '/contact?interest=citc&source=founder-access',
    fit: 'high' as CommercialFit,
  },
} as const;

/**
 * Sequential — first match wins. Order is load-bearing: someone who is
 * Transferable but asked to be *diagnosed* is deliberately caught by rule 2 and
 * sent to the Map rather than sold a build they did not ask for.
 */
export function recommendOffer(
  result: AssessmentResult,
  q: Qualification
): OfferRecommendation {
  const { stage } = result;

  if (q.business_context === 'early_stage' || stage === 'Founder-held') {
    return {
      ...OFFERS.nurture,
      why: 'You have a method worth building on, but not yet the evidence a build would need. Buying architecture now would mean paying to structure something that is still moving. Read first, then come back — the assessment will show the change.',
    };
  }

  if (stage === 'Documented' || q.preferred_build_mode === 'diagnose') {
    return {
      ...OFFERS.integration_map,
      why: 'You do not need more captured material. You need to know which layer is actually blocking transfer, and in what order to fix it. That is the Map: a paid diagnostic that ends with a sequence, and it credits toward a build within 60 days.',
    };
  }

  if (
    q.business_context === 'programme' &&
    (q.highest_value_application === 'client_delivery' ||
      q.highest_value_application === 'licensing_transfer') &&
    (stage === 'Transferable' || stage === 'Codified')
  ) {
    return {
      ...OFFERS.embedded_genius,
      why: 'You have a programme, a transferable method, and you want it working inside client delivery. That is the case where your methodology stops being documentation and gets deployed as tools your members actually use.',
    };
  }

  if (q.preferred_build_mode === 'guided_build') {
    return {
      ...OFFERS.atelier,
      why: 'You want to build it yourself, with someone who has done it before sitting next to you. The Atelier is eight weeks of fittings: you leave with your own Pattern Book and the first system built by your own hands.',
    };
  }

  if (stage === 'Codified') {
    return {
      ...OFFERS.residency,
      why: 'The architecture exists. What changes outcomes now is adoption and maintenance — a monthly build sprint against the next highest-value application, rather than another round of capture.',
    };
  }

  return {
    ...OFFERS.citc,
    why: 'You have the method and the evidence, and you want the architecture built rather than explained. A single intensive day extracts the judgement and leaves with it structured and running.',
  };
}

/* ── Content routing ─────────────────────────────────────────────────────── */

/**
 * Three articles per constraint. `url: null` means the piece is written but not
 * published — per the brief, a draft is never linked. The result page renders
 * only what is live, so each of these lights up on its own the moment the URL
 * is filled in. Verified 2026-08-16: exactly one of the thirteen is published.
 */
export interface ArticleLink {
  title: string;
  url: string | null;
}

const BEHIND = {
  title: 'You Are Not Behind on AI. You Are Behind on Yourself.',
  url: '/blog/you-are-not-behind-on-ai-you-are',
};

export const CONSTRAINT_ARTICLES: Record<DimensionId, readonly ArticleLink[]> = {
  ip_strength: [
    { title: 'Your Genius Lives in Your Files', url: null },
    BEHIND,
    { title: "You Are Irreplaceable. Your Patterns Aren't.", url: null },
  ],
  judgement_articulation: [
    { title: 'Adopt Your Judgement, Not Your Tasks', url: null },
    { title: 'Nobody Needs a Clone', url: null },
    { title: "Nobody Gets a Prompt Until They've Been Through the Archaeology", url: null },
  ],
  transferability: [
    { title: 'The Asset a Buyer Pays For', url: null },
    { title: 'Automation Scales Your Absence', url: null },
    { title: "You Are Irreplaceable. Your Patterns Aren't.", url: null },
  ],
  machine_readiness: [
    { title: 'The Three Languages Your Business Now Speaks', url: null },
    { title: 'The Tell Check', url: null },
    { title: "Nobody Gets a Prompt Until They've Been Through the Archaeology", url: null },
  ],
  activation_governance: [
    // "Adoption Is the Work" does not exist under that title. The nearest real
    // draft is "The Word Nobody Selling You AI Will Say", which is the adoption
    // piece. Titled here as it actually is, so the link is not a promise of
    // something unwritten.
    { title: 'The Word Nobody Selling You AI Will Say', url: null },
    { title: 'AI-for-Productivity Ends at Your Inbox', url: null },
    // "The System Was Waiting for Her Eyes" was not found anywhere — not in the
    // database, the drafts folder or the Substack catalog. Left out rather than
    // invented.
    BEHIND,
  ],
};

export function articlesFor(constraint: DimensionId): ArticleLink[] {
  return CONSTRAINT_ARTICLES[constraint].filter((article) => article.url !== null);
}
