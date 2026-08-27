'use client';

/**
 * The Readability Audit — the shareable lead magnet.
 *
 * Someone types their website and gets an honest, instant read on whether a
 * human, an AI answer engine and an autonomous agent can each actually read
 * their business. Results show IMMEDIATELY and in full — no email gate.
 *
 * That is deliberate. MI's own standard for a sell she respects: appeal to
 * intelligence, name the truth, never manufacture shame to force an opt-in.
 * The email ask comes after the value has already been handed over.
 */

import { useState } from 'react';

type Check = {
  id: string;
  audience: 'human' | 'llm' | 'agent';
  label: string;
  status: 'pass' | 'warn' | 'fail';
  detail: string;
  why: string;
};

type Result = {
  url: string;
  score: number;
  verdict: string;
  passes: number;
  fails: number;
  total: number;
  checks: Check[];
};

const AUDIENCE = {
  human: { title: 'Humans', blurb: 'The person who lands at 11pm and decides in ten seconds.' },
  llm: { title: 'AI answer engines', blurb: 'ChatGPT, Claude, Perplexity, AI Overviews — deciding whether to quote you.' },
  agent: { title: 'Agents', blurb: 'Software sent to find out what you do and what you sell.' },
} as const;

const MARK = { pass: '●', warn: '◐', fail: '○' } as const;
const TONE = {
  pass: 'text-[color:var(--ok)]',
  warn: 'text-[color:var(--warn)]',
  fail: 'text-[color:var(--bad)]',
} as const;

export default function ReadabilityPage() {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [captureNote, setCaptureNote] = useState('');

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(''); setResult(null); setSent(false);
    try {
      const res = await fetch('/api/presence', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Something went wrong. Try again.');
      else setResult(data);
    } catch {
      setError('Could not reach that site.');
    } finally {
      setBusy(false);
    }
  }

  async function capture(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !result) return;
    try {
      // Sends the report AND captures the lead. Says only what actually
      // happened — the previous version claimed "check your inbox" whether or
      // not anything had been sent, and nothing ever was.
      const res = await fetch('/api/presence/report', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email,
          url: result.url,
          score: result.score,
          verdict: result.verdict,
          checks: result.checks,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCaptureNote(data.error || 'That did not go through. Try again?');
        return;
      }
      setSent(true);
      setCaptureNote(
        data.sent
          ? ''
          : 'Saved — but the email did not go out just now, so I will send it by hand. Sorry about that.'
      );
    } catch {
      setCaptureNote('That did not go through. Try again?');
    }
  }

  return (
    <div className="ra min-h-screen px-6 py-20">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="mx-auto max-w-[820px]">
        <p className="lbl text-[color:var(--ox)]">The Readability Audit</p>
        <h1 className="nr mt-5 text-[2.4rem] leading-[1.06] md:text-[3.4rem]">
          Can anyone actually read your business?
        </h1>
        <p className="mt-6 max-w-[46em] text-[1.05rem] leading-[1.7]">
          Not whether your site looks good. Whether a person, an AI answer engine and an
          autonomous agent can each work out what you do, who you do it for, and what you
          sell. Twelve checks, about fifteen seconds, and you see all of it.
        </p>

        <form onSubmit={run} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourwebsite.com"
            className="flex-1 border border-[color:var(--hair)] bg-white px-5 py-4 text-[1rem] outline-none focus:border-[color:var(--ox)]"
          />
          <button
            type="submit"
            disabled={busy || !url}
            className="lbl bg-[color:var(--ox)] px-8 py-4 text-white transition-opacity disabled:opacity-40"
          >
            {busy ? 'Reading…' : 'Run the audit'}
          </button>
        </form>
        {error && <p className="mt-4 text-[0.95rem] text-[color:var(--bad)]">{error}</p>}

        {result && (
          <div className="mt-16">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-y-2 border-[color:var(--ink)] py-6">
              <div>
                <p className="lbl text-[color:var(--ink)]/60">{result.url}</p>
                <p className="nr mt-2 text-[2.2rem] leading-none">{result.verdict}</p>
              </div>
              <p className="num text-[3.4rem] leading-none">{result.score}<span className="text-[1.4rem]">/100</span></p>
            </div>
            <p className="mt-4 text-[0.95rem] text-[color:var(--ink)]/70">
              {result.passes} of {result.total} checks passed{result.fails > 0 && `, ${result.fails} failing outright`}.
            </p>

            {(['human', 'llm', 'agent'] as const).map((aud) => {
              const items = result.checks.filter((c) => c.audience === aud);
              if (!items.length) return null;
              return (
                <section key={aud} className="mt-14">
                  <h2 className="nr text-[1.6rem]">{AUDIENCE[aud].title}</h2>
                  <p className="mt-1 text-[0.95rem] text-[color:var(--ink)]/65">{AUDIENCE[aud].blurb}</p>
                  <ul className="mt-6 border-t border-[color:var(--hair)]">
                    {items.map((c) => (
                      <li key={c.id} className="border-b border-[color:var(--hair)] py-5">
                        <div className="flex items-baseline gap-4">
                          <span className={`${TONE[c.status]} text-[1.1rem] leading-none`}>{MARK[c.status]}</span>
                          <div>
                            <p className="text-[1.02rem] font-medium">{c.label}</p>
                            <p className="mt-1 text-[0.95rem] text-[color:var(--ink)]/75">{c.detail}</p>
                            {c.status !== 'pass' && (
                              <p className="mt-2 max-w-[52em] text-[0.92rem] italic text-[color:var(--ink)]/60">{c.why}</p>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}

            <div className="mt-16 border-t-2 border-[color:var(--ink)] pt-8">
              {sent ? (
                <div>
                  <p className="nr text-[1.4rem]">
                    {captureNote ? 'Got it.' : 'Sent. Check your inbox.'}
                  </p>
                  {captureNote && (
                    <p className="mt-2 text-[0.95rem] text-[color:var(--ink)]/70">{captureNote}</p>
                  )}
                </div>
              ) : (
                <>
                  <p className="nr text-[1.5rem] leading-[1.35]">
                    Want this as something you can hand to whoever builds your site?
                  </p>
                  <p className="mt-3 max-w-[44em] text-[1rem] leading-[1.7]">
                    I&rsquo;ll send the results with what to fix first and why it matters. No sequence,
                    no funnel. If you want more than that afterwards, you&rsquo;ll ask.
                  </p>
                  <form onSubmit={capture} className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@yourcompany.com"
                      className="flex-1 border border-[color:var(--hair)] bg-white px-5 py-4 outline-none focus:border-[color:var(--ox)]"
                    />
                    <button type="submit" className="lbl bg-[color:var(--ink)] px-8 py-4 text-white">
                      Send it to me
                    </button>
                  </form>
                  {captureNote && (
                    <p className="mt-3 text-[0.95rem] text-[color:var(--bad)]">{captureNote}</p>
                  )}
                </>
              )}
              <p className="mt-10 text-[0.95rem] text-[color:var(--ink)]/70">
                Built by <a href="/about" className="underline underline-offset-4">Maria-Ines</a> at Envisioned —
                who does this to whole businesses, not just their websites.{' '}
                <a href="/founder-access" className="underline underline-offset-4">Take the deeper assessment →</a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Courier+Prime:wght@400&display=swap');
.ra { --ivory:#FBFAF9; --ink:#1E1E1E; --ox:#4C5A2E; --hair:rgba(30,30,30,0.14);
  --ok:#4C5A2E; --warn:#B87A5D; --bad:#8C3A2E;
  font-family:'Inter',system-ui,sans-serif; background:var(--ivory); color:var(--ink); }
.ra .nr { font-family:'Megante',Georgia,serif; font-weight:400; letter-spacing:0.005em; }
.ra .num { font-family:'Megante',Georgia,serif; }
.ra .lbl { font-family:'Courier Prime',monospace; text-transform:uppercase; letter-spacing:0.3em; font-size:0.72rem; }
`;
