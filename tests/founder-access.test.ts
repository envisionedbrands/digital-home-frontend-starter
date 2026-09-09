import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DIAGNOSTIC_QUESTIONS,
  DIMENSIONS,
  ROUTING_QUESTIONS,
  TOTAL_QUESTIONS,
  articlesFor,
  calculateAssessment,
  recommendOffer,
  type Answers,
  type DimensionId,
  type Qualification,
} from '../src/lib/assessment/founder-access.ts';

/** Every diagnostic answer at the same value. */
const all = (value: number): Answers =>
  Object.fromEntries(DIAGNOSTIC_QUESTIONS.map((question) => [question.id, value]));

/** Override one dimension's two questions, leaving the rest untouched. */
const set = (answers: Answers, dimension: DimensionId, value: number): Answers => {
  const next = { ...answers };
  DIAGNOSTIC_QUESTIONS.filter((question) => question.dimension === dimension).forEach(
    (question) => {
      next[question.id] = value;
    }
  );
  return next;
};

/**
 * Transferable is the one stage a flat profile cannot reach. Its gate is
 * "transferability is fine, but machine readiness or governance is not", so it
 * requires an uneven answer set by definition. Worth knowing when hand-testing:
 * answering the same number all the way down skips straight from Structured to
 * Codified.
 */
const TRANSFERABLE = set(all(3), 'machine_readiness', 2);

const routing = (overrides: Partial<Qualification> = {}): Qualification => ({
  highest_value_application: 'team_operations',
  preferred_build_mode: 'built_for_me',
  business_context: 'team_service',
  ...overrides,
});

/* ── Shape ───────────────────────────────────────────────────────────────── */

test('the assessment is ten diagnostic questions and three routing questions', () => {
  assert.equal(DIAGNOSTIC_QUESTIONS.length, 10);
  assert.equal(ROUTING_QUESTIONS.length, 3);
  assert.equal(TOTAL_QUESTIONS, 13);
});

test('every diagnostic question offers exactly five answers, scored 0 to 4', () => {
  for (const question of DIAGNOSTIC_QUESTIONS) {
    assert.equal(question.options.length, 5, `${question.id} must offer five answers`);
  }
  assert.equal(calculateAssessment(all(0)).rawScore, 0);
  assert.equal(calculateAssessment(all(4)).rawScore, 40);
  assert.equal(calculateAssessment(all(0)).score, 0);
  assert.equal(calculateAssessment(all(4)).score, 100);
});

test('each of the five dimensions is measured by two questions', () => {
  for (const dimension of DIMENSIONS) {
    const owned = DIAGNOSTIC_QUESTIONS.filter((question) => question.dimension === dimension.id);
    assert.equal(owned.length, 2, `${dimension.id} should have two questions`);
  }
});

test('rejects missing and out-of-range answers', () => {
  assert.throws(() => calculateAssessment({}), /Invalid or missing answer/);
  const tooHigh = all(2);
  tooHigh[DIAGNOSTIC_QUESTIONS[0].id] = 5;
  assert.throws(() => calculateAssessment(tooHigh), /Invalid or missing answer/);
  const negative = all(2);
  negative[DIAGNOSTIC_QUESTIONS[0].id] = -1;
  assert.throws(() => calculateAssessment(negative), /Invalid or missing answer/);
});

/* ── The gate ────────────────────────────────────────────────────────────── */
/* This is the difference between v2 and the averaged v1 pilot: a weak layer
   cannot be compensated for by a strong one further along. */

test('the stage gate stops at the first failing layer', () => {
  assert.equal(calculateAssessment(all(1)).stage, 'Founder-held');
  assert.equal(calculateAssessment(all(2)).stage, 'Structured');
  assert.equal(calculateAssessment(TRANSFERABLE).stage, 'Transferable');
  assert.equal(calculateAssessment(all(4)).stage, 'Codified');

  // An even 3 across the board clears every gate — there is no Transferable
  // band on a flat profile, and that is the model working as designed.
  assert.equal(calculateAssessment(all(3)).stage, 'Codified');

  // Documented needs IP through the gate but judgement still below it.
  const documented = set(all(4), 'judgement_articulation', 1);
  assert.equal(calculateAssessment(documented).stage, 'Documented');
});

test('a perfect AI stack cannot lift a founder past weak IP', () => {
  const flattering = set(all(4), 'ip_strength', 0);
  const result = calculateAssessment(flattering);

  assert.equal(result.stage, 'Founder-held');
  assert.equal(result.primaryConstraint, 'ip_strength');
  // The percentage is high — which is exactly why the stage, not the score, is
  // the headline on the result page.
  assert.equal(result.score, 80);
});

test('the primary constraint is the gate that failed, not simply the lowest score', () => {
  // Judgement fails its gate at 1.0; machine readiness is lower still at 0.
  const answers = set(set(all(4), 'judgement_articulation', 1), 'machine_readiness', 0);
  const result = calculateAssessment(answers);

  assert.equal(result.stage, 'Documented');
  assert.equal(result.primaryConstraint, 'judgement_articulation');
});

test('at Codified, with no gate failed, the constraint falls back to the lowest layer', () => {
  const answers = set(all(4), 'activation_governance', 3);
  const result = calculateAssessment(answers);

  assert.equal(result.stage, 'Codified');
  assert.equal(result.primaryConstraint, 'activation_governance');
});

test('scores are reported on the native 0 to 4 dimension scale', () => {
  const answers = { ...all(2) };
  answers[DIAGNOSTIC_QUESTIONS[0].id] = 4; // one of the two IP questions
  const result = calculateAssessment(answers);

  assert.equal(result.dimensionScores.ip_strength, 3);
  assert.equal(result.dimensionScores.transferability, 2);
});

/* ── The five essential test profiles ────────────────────────────────────── */
/* Taken verbatim from the recreation brief: "Test at least these paths before
   publishing." Each asserts the offer the brief names. */

test('profile 1 — all answers at 0, earlier-stage business → nurture first', () => {
  const result = calculateAssessment(all(0));
  const offer = recommendOffer(result, routing({ business_context: 'early_stage' }));

  assert.equal(result.stage, 'Founder-held');
  assert.equal(offer.id, 'nurture');
  assert.equal(offer.price, 'Nurture first');
});

test('profile 2 — answers around 2, "diagnose and prioritise" → Integration Map', () => {
  const result = calculateAssessment(all(2));
  const offer = recommendOffer(result, routing({ preferred_build_mode: 'diagnose' }));

  assert.equal(offer.id, 'integration_map');
  assert.equal(offer.price, '€1,500');
});

test('profile 3 — high scores, programme, client delivery, built for me → falls through to Codified in the City while Embedded Genius is off the visible list', () => {
  // Embedded Genius rule is commented out (2026-09-09, MI's go — only Map /
  // Integration Map / Codified in the City visible for now). Restore the
  // original assertion ('embedded_genius') if the rule is re-enabled.
  const result = calculateAssessment(all(4));
  const offer = recommendOffer(
    result,
    routing({
      business_context: 'programme',
      highest_value_application: 'client_delivery',
      preferred_build_mode: 'built_for_me',
    })
  );

  assert.equal(result.stage, 'Codified');
  assert.equal(offer.id, 'citc');
});

test('profile 4 — structured scores, "build with expert guidance" → falls through to Codified in the City while The Atelier is paused', () => {
  // The Atelier rule is commented out in recommendOffer (DECISIONS #021,
  // paused 2026-09-02, disabled here 2026-09-09 on MI's go). This profile
  // used to land on 'atelier'; it now falls through to the final default
  // rule. Restore the original assertion ('atelier') if the pause lifts
  // and the rule is re-enabled.
  const result = calculateAssessment(all(2));
  const offer = recommendOffer(result, routing({ preferred_build_mode: 'guided_build' }));

  assert.equal(result.stage, 'Structured');
  assert.equal(offer.id, 'citc');
});

test('profile 5 — high scores, non-programme business → falls through to Codified in the City while The Residency is off the visible list', () => {
  // Residency rule is commented out (2026-09-09, same go as above). Restore
  // the original assertion ('residency') if the rule is re-enabled.
  const result = calculateAssessment(all(4));
  const offer = recommendOffer(result, routing({ business_context: 'team_service' }));

  assert.equal(result.stage, 'Codified');
  assert.equal(offer.id, 'citc');
});

test('a qualified founder who matches no earlier rule is routed to Codified in the City', () => {
  const result = calculateAssessment(TRANSFERABLE);
  const offer = recommendOffer(result, routing());

  assert.equal(result.stage, 'Transferable');
  assert.equal(offer.id, 'citc');
  assert.equal(offer.price, '€5,500');
});

/* ── Routing order ───────────────────────────────────────────────────────── */

test('asking to be diagnosed outranks a build recommendation', () => {
  // This profile would otherwise reach Codified in the City. Someone who asked
  // to be diagnosed is not sold a build they did not ask for.
  const result = calculateAssessment(TRANSFERABLE);
  assert.equal(recommendOffer(result, routing({ preferred_build_mode: 'diagnose' })).id, 'integration_map');
});

test('an earlier-stage business is never sold a build, however well it scores', () => {
  const result = calculateAssessment(all(4));
  const offer = recommendOffer(
    result,
    routing({ business_context: 'early_stage', preferred_build_mode: 'built_for_me' })
  );

  assert.equal(result.stage, 'Codified');
  assert.equal(offer.id, 'nurture');
});

test('every offer recommendation explains itself and points somewhere', () => {
  for (const mode of ['diagnose', 'guided_build', 'built_for_me'] as const) {
    for (const context of ['programme', 'team_service', 'solo_at_capacity', 'early_stage'] as const) {
      for (const value of [0, 1, 2, 3, 4]) {
        const offer = recommendOffer(
          calculateAssessment(all(value)),
          routing({ preferred_build_mode: mode, business_context: context })
        );
        assert.ok(offer.why.length > 40, `${offer.id} needs a real reason`);
        assert.ok(offer.ctaHref.startsWith('/'), `${offer.id} needs a working link`);
        assert.ok(offer.ctaLabel.length > 0);
      }
    }
  }
});

/* ── Content routing ─────────────────────────────────────────────────────── */

test('only published articles are ever offered', () => {
  for (const dimension of DIMENSIONS) {
    for (const article of articlesFor(dimension.id)) {
      assert.ok(article.url, `${article.title} was offered without a live URL`);
      assert.ok(article.url!.startsWith('/blog/'), `${article.title} must link into /blog`);
    }
  }
});
