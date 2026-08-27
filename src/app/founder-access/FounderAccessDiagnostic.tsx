'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  APPLICATIONS,
  ASSESSMENT_LABEL,
  DIAGNOSTIC_QUESTIONS,
  DIMENSIONS,
  ROUTING_QUESTIONS,
  STAGE_COPY,
  TOTAL_QUESTIONS,
  articlesFor,
  calculateAssessment,
  getDimension,
  type Answers,
  type AssessmentResult,
  type OfferRecommendation,
  type Qualification,
} from '@/lib/assessment/founder-access';
import styles from './founder-access.module.css';

type Screen = 'intro' | 'question' | 'capture' | 'result';

interface SubmissionResponse {
  ok: boolean;
  result: AssessmentResult;
  offer: OfferRecommendation;
  error?: string;
}

/**
 * The thirteen screens are one flat list so "Question X of 13" is a single
 * index rather than two counters that can drift apart. Diagnostic questions
 * carry a dimension and score by option index; routing questions carry a
 * qualification key and never touch the score.
 */
type Step =
  | { kind: 'diagnostic'; id: string; question: string; facet: string; dimensionName: string; options: readonly string[] }
  | { kind: 'routing'; id: keyof Qualification; question: string; options: readonly { value: string; label: string }[] };

const STEPS: Step[] = [
  ...DIAGNOSTIC_QUESTIONS.map((q): Step => ({
    kind: 'diagnostic',
    id: q.id,
    question: q.question,
    facet: q.facet,
    dimensionName: getDimension(q.dimension).name,
    options: q.options,
  })),
  ...ROUTING_QUESTIONS.map((q): Step => ({
    kind: 'routing',
    id: q.id as keyof Qualification,
    question: q.question,
    options: q.options as readonly { value: string; label: string }[],
  })),
];

function createSessionId(): string {
  if (typeof window === 'undefined') return '';
  const existing = window.sessionStorage.getItem('founder-access-session');
  if (existing) return existing;
  const value =
    window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.sessionStorage.setItem('founder-access-session', value);
  return value;
}

function scrollToTop() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
}

export default function FounderAccessDiagnostic() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [qualification, setQualification] = useState<Partial<Qualification>>({});
  const [sessionId, setSessionId] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [serverResult, setServerResult] = useState<AssessmentResult | null>(null);
  const [offer, setOffer] = useState<OfferRecommendation | null>(null);
  /**
   * `website` is the honeypot, not a real field — the backend capture route
   * drops any submission where it is filled (capture/route.ts). The brief's
   * genuine "website or primary profile" is `profileUrl`, which travels as a
   * custom field. Never swap these two names.
   */
  const [identity, setIdentity] = useState({
    name: '',
    email: '',
    company: '',
    profileUrl: '',
    website: '',
    marketingConsent: false,
  });

  const current = STEPS[step];

  /**
   * The teaser has to name the stage before the email is handed over, so the
   * client scores a preview locally. It is never what gets stored — the POST
   * re-runs the same function on the server and the result rendered on the
   * final screen is the server's, so the row in `assessment_completions` and
   * the page the founder reads can never disagree.
   */
  const previewResult = useMemo(() => {
    if (Object.keys(answers).length !== DIAGNOSTIC_QUESTIONS.length) return null;
    try {
      return calculateAssessment(answers);
    } catch {
      return null;
    }
  }, [answers]);

  const result = serverResult || previewResult;

  useEffect(() => setSessionId(createSessionId()), []);

  function sendEvent(eventType: string, eventData: Record<string, unknown> = {}) {
    if (!sessionId) return;
    void fetch('/api/founder-access/event', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        eventType,
        eventData,
        pageUrl: window.location.href,
        referrer: document.referrer,
      }),
      keepalive: true,
    }).catch(() => undefined);
  }

  const answered =
    current?.kind === 'diagnostic'
      ? typeof answers[current.id] === 'number'
      : Boolean(current && qualification[current.id as keyof Qualification]);

  function begin() {
    setScreen('question');
    setStep(0);
    sendEvent('start', { question_id: STEPS[0].id, question_index: 1 });
  }

  function choose(value: number | string) {
    if (current.kind === 'diagnostic') {
      setAnswers((previous) => ({ ...previous, [current.id]: value as number }));
    } else {
      setQualification((previous) => ({ ...previous, [current.id]: value as string }));
    }
    setValidationMessage('');
  }

  function goForward() {
    if (!answered) {
      setValidationMessage('Choose the answer closest to where you are today.');
      return;
    }
    if (step < STEPS.length - 1) {
      const next = step + 1;
      setStep(next);
      sendEvent('view', { question_id: STEPS[next].id, question_index: next + 1 });
    } else {
      setScreen('capture');
      sendEvent('view', { question_id: 'capture', question_index: TOTAL_QUESTIONS + 1 });
    }
    setValidationMessage('');
    scrollToTop();
  }

  function goBack() {
    setValidationMessage('');
    if (step === 0) {
      setScreen('intro');
    } else {
      setStep(step - 1);
    }
    scrollToTop();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/founder-access/complete', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...identity,
          qualification,
          answers,
          sessionId,
          pageUrl: window.location.href,
          referrer: document.referrer,
        }),
      });
      const data = (await response.json()) as SubmissionResponse;
      if (!response.ok || !data.ok) throw new Error(data.error || 'We could not save your result.');
      setServerResult(data.result);
      setOffer(data.offer);
      setScreen('result');
      // One event carries completions, result stages, offer recommendations and
      // opt-ins, so the funnel report reads from a single row per finisher.
      sendEvent('complete', {
        stage: data.result.stage,
        primary_constraint: data.result.primaryConstraint,
        score: data.result.score,
        recommended_offer: data.offer.id,
        marketing_consent: identity.marketingConsent,
      });
      scrollToTop();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'We could not save your result. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  /**
   * "Try another path" clears the answers but keeps the session, so a second
   * run through different choices is visible in the funnel as the same visitor
   * exploring rather than as a new lead.
   */
  function tryAnotherPath() {
    setAnswers({});
    setQualification({});
    setServerResult(null);
    setOffer(null);
    setStep(0);
    setScreen('question');
    setValidationMessage('');
    setSubmitError('');
    sendEvent('start', { question_id: STEPS[0].id, question_index: 1, retake: true });
    scrollToTop();
  }

  const stageCopy = result ? STAGE_COPY[result.stage] : null;
  const constraint = result ? getDimension(result.primaryConstraint) : null;
  const articles = result ? articlesFor(result.primaryConstraint) : [];
  const application = APPLICATIONS.find(
    (option) => option.value === qualification.highest_value_application
  );

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        {screen === 'intro' && (
          <section className={styles.intro} aria-labelledby="assessment-title">
            <p className="kicker">{ASSESSMENT_LABEL}</p>
            <h1 id="assessment-title" className={`display ${styles.title}`}>
              How much of your business still depends on you?
            </h1>
            <p className={styles.lede}>
              You may already have documents, processes and AI tools. The question is whether any of
              them can carry your judgement when you are not in the room.
            </p>
            <div className={styles.promiseGrid}>
              <div>
                <span>13</span>
                <p>questions</p>
              </div>
              <div>
                <span>5</span>
                <p>layers between instinct and infrastructure</p>
              </div>
              <div>
                <span>4 min</span>
                <p>to a named constraint and a next move</p>
              </div>
            </div>
            <button type="button" className={styles.primaryButton} onClick={begin}>
              Begin the assessment
            </button>
            <p className={styles.finePrint}>
              A strategic diagnostic, not a personality test. Answer for where you are today, not
              where you intend to be.
            </p>
          </section>
        )}

        {screen === 'question' && (
          <section className={styles.questionScreen} aria-labelledby="question-title">
            <header className={styles.questionHeader}>
              <p className="kicker">
                Question {step + 1} of {TOTAL_QUESTIONS}
              </p>
              <p className={styles.questionContext}>
                {current.kind === 'diagnostic'
                  ? `${current.dimensionName} · ${current.facet}`
                  : 'Where this goes next'}
              </p>
            </header>

            <div
              className={styles.progressTrack}
              role="progressbar"
              aria-valuenow={step + 1}
              aria-valuemin={1}
              aria-valuemax={TOTAL_QUESTIONS}
              aria-label={`Question ${step + 1} of ${TOTAL_QUESTIONS}`}
            >
              <span style={{ width: `${((step + 1) / TOTAL_QUESTIONS) * 100}%` }} />
            </div>

            <fieldset className={styles.questionCard}>
              <legend id="question-title" className={`display ${styles.questionText}`}>
                {current.question}
              </legend>
              <div className={styles.answerStack}>
                {current.kind === 'diagnostic'
                  ? current.options.map((label, index) => (
                      <label
                        key={label}
                        className={answers[current.id] === index ? styles.answerSelected : ''}
                      >
                        <input
                          type="radio"
                          name={current.id}
                          checked={answers[current.id] === index}
                          onChange={() => choose(index)}
                        />
                        <span className={styles.answerMark} aria-hidden="true" />
                        <span>{label}</span>
                      </label>
                    ))
                  : current.options.map((option) => (
                      <label
                        key={option.value}
                        className={
                          qualification[current.id as keyof Qualification] === option.value
                            ? styles.answerSelected
                            : ''
                        }
                      >
                        <input
                          type="radio"
                          name={current.id}
                          checked={qualification[current.id as keyof Qualification] === option.value}
                          onChange={() => choose(option.value)}
                        />
                        <span className={styles.answerMark} aria-hidden="true" />
                        <span>{option.label}</span>
                      </label>
                    ))}
              </div>
            </fieldset>

            {validationMessage && (
              <p className={styles.error} role="alert">
                {validationMessage}
              </p>
            )}

            <div className={styles.actions}>
              <button type="button" className={styles.textButton} onClick={goBack}>
                Back
              </button>
              <button type="button" className={styles.primaryButton} onClick={goForward}>
                {step === STEPS.length - 1 ? 'See your position' : 'Continue'}
              </button>
            </div>
          </section>
        )}

        {screen === 'capture' && result && constraint && (
          <section className={styles.capture} aria-labelledby="capture-title">
            <div className={styles.teaser}>
              <p className="kicker">Your position</p>
              <h1 id="capture-title" className={`display ${styles.captureTitle}`}>
                You have reached the {result.stage} stage.
              </h1>
              <p className={styles.constraintLine}>
                Your primary constraint is <strong>{constraint.name.toLowerCase()}</strong>.
              </p>
              <p>
                The full result explains what that stage actually means, scores all five layers, and
                names the one thing worth doing next.
              </p>
            </div>

            <form className={styles.captureForm} onSubmit={submit}>
              <p className="kicker">See the full result</p>
              <div className={styles.twoColumns}>
                <label>
                  First name
                  <input
                    required
                    autoComplete="given-name"
                    value={identity.name}
                    onChange={(e) => setIdentity({ ...identity, name: e.target.value })}
                  />
                </label>
                <label>
                  Work email
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={identity.email}
                    onChange={(e) => setIdentity({ ...identity, email: e.target.value })}
                  />
                </label>
              </div>
              <div className={styles.twoColumns}>
                <label>
                  Business name <span>Optional</span>
                  <input
                    autoComplete="organization"
                    value={identity.company}
                    onChange={(e) => setIdentity({ ...identity, company: e.target.value })}
                  />
                </label>
                <label>
                  Website or profile <span>Optional</span>
                  <input
                    autoComplete="url"
                    inputMode="url"
                    placeholder="yourbusiness.com"
                    value={identity.profileUrl}
                    onChange={(e) => setIdentity({ ...identity, profileUrl: e.target.value })}
                  />
                </label>
              </div>
              <label className={styles.honeypot} aria-hidden="true">
                Fax
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={identity.website}
                  onChange={(e) => setIdentity({ ...identity, website: e.target.value })}
                />
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={identity.marketingConsent}
                  onChange={(e) => setIdentity({ ...identity, marketingConsent: e.target.checked })}
                />
                <span>
                  Send me occasional writing on founder intelligence and AI infrastructure.
                  Optional.
                </span>
              </label>
              {submitError && (
                <p className={styles.error} role="alert">
                  {submitError}
                </p>
              )}
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={submitting || !sessionId}
              >
                {submitting ? 'Building your result…' : 'Show my full result'}
              </button>
              <p className={styles.privacy}>
                Your result is stored so Envisioned can give you a relevant next step. Marketing
                permission is separate, and you can withdraw it at any time.
              </p>
            </form>
          </section>
        )}

        {screen === 'result' && result && stageCopy && constraint && (
          <section className={styles.results} aria-labelledby="result-title">
            <header className={styles.resultHeader}>
              <div>
                <p className="kicker">{ASSESSMENT_LABEL}</p>
                <h1 id="result-title" className={`display ${styles.resultTitle}`}>
                  {result.stage}
                </h1>
                <p className={styles.resultHeadline}>{stageCopy.headline}</p>
              </div>
              <div className={styles.resultScore}>
                <strong>{result.score}</strong>
                <span>out of 100</span>
              </div>
            </header>

            <div className={styles.resultNarrative}>
              <div>
                <p className="kicker">What this stage means</p>
                <p>{stageCopy.explanation}</p>
              </div>
              <div>
                <p className="kicker">Your primary constraint</p>
                <p>
                  <strong>{constraint.name}.</strong> {constraint.question}
                </p>
                {application && (
                  <p className={styles.applicationLine}>
                    Highest-value application: <strong>{application.label.toLowerCase()}</strong>
                  </p>
                )}
              </div>
            </div>

            <section className={styles.dimensionResults} aria-labelledby="dimensions-title">
              <div className={styles.sectionHeading}>
                <p className="kicker">The five layers</p>
                <h2 id="dimensions-title" className="display">
                  Where it holds, and where it breaks
                </h2>
              </div>
              {DIMENSIONS.map((dimension) => {
                const value = result.dimensionScores[dimension.id];
                const isConstraint = dimension.id === result.primaryConstraint;
                return (
                  <div
                    key={dimension.id}
                    className={`${styles.dimensionRow} ${isConstraint ? styles.dimensionConstraint : ''}`}
                  >
                    <div>
                      <strong>{dimension.name}</strong>
                      <span>{isConstraint ? 'Primary constraint' : dimension.question}</span>
                    </div>
                    <div
                      className={styles.dimensionBar}
                      role="img"
                      aria-label={`${dimension.name}: ${value} out of 4`}
                    >
                      <span style={{ width: `${(value / 4) * 100}%` }} />
                    </div>
                    <span className={styles.dimensionValue}>{value.toFixed(1)}</span>
                  </div>
                );
              })}
            </section>

            {articles.length > 0 && (
              <section className={styles.reading} aria-labelledby="reading-title">
                <p className="kicker">Written for exactly this</p>
                <h2 id="reading-title" className="display">
                  Start here
                </h2>
                <ul>
                  {articles.map((article) => (
                    <li key={article.title}>
                      <Link
                        href={article.url as string}
                        onClick={() =>
                          sendEvent('cta_click', {
                            type: 'article',
                            title: article.title,
                            constraint: result.primaryConstraint,
                          })
                        }
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {offer && (
              <aside className={styles.nextStep}>
                <p className="kicker">The useful next move</p>
                <h2 className="display">{offer.name}</h2>
                <p>{offer.why}</p>
                <p className={styles.offerPrice}>{offer.price}</p>
                <Link
                  href={offer.ctaHref}
                  className={styles.primaryButton}
                  onClick={() =>
                    sendEvent('cta_click', {
                      type: 'offer',
                      offer: offer.id,
                      stage: result.stage,
                      href: offer.ctaHref,
                    })
                  }
                >
                  {offer.ctaLabel}
                </Link>
              </aside>
            )}

            <button type="button" className={styles.textButton} onClick={tryAnotherPath}>
              Try another path
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
