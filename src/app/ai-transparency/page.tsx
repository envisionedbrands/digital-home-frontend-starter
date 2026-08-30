import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Transparency — Envisioned',
  description:
    'How Envisioned uses AI, what stays human, and the policy on training, retrieval, and attribution. The standing disclosure.',
};

export default function AITransparencyPage() {
  return (
    <main className="min-h-screen px-6 pt-40 pb-32 flex flex-col justify-center">
      <div className="max-w-[900px] mx-auto w-full">
        <p className="kicker mb-8">AI Transparency</p>

        <h1 className="display text-4xl md:text-6xl xl:text-7xl text-ink mb-8">
          This is how AI works here.
          <br />
          No fine print.
        </h1>

        <div className="max-w-[40em] space-y-6 text-[1.15rem] text-ink-soft leading-[1.8] mb-20">
          <p>
            Every business that touches AI owes you a straight answer about
            where the line is. This page is that answer.
          </p>
        </div>

        {/* ── What AI does here ── */}
        <div className="border-t border-hair-olive pt-10 mb-16">
          <p className="kicker mb-6">What AI does here</p>
          <div className="max-w-[40em] space-y-5 text-[1.08rem] text-taupe leading-[1.75]">
            <p>
              AI (Claude by Anthropic) handles research, drafting, scheduling,
              data analysis, and client system builds. Every client engagement
              uses AI as a delivery layer. AI-generated images are produced
              with Nano Banana 2 (Google) and reviewed against a 12-point
              creative direction checklist before publication.
            </p>
            <p>
              The infrastructure I build for clients is AI-powered by design.
              That is not an add-on. It is the product.
            </p>
          </div>
        </div>

        {/* ── What stays human ── */}
        <div className="border-t border-hair-olive pt-10 mb-16">
          <p className="kicker mb-6">What stays human</p>
          <div className="max-w-[40em] space-y-5 text-[1.08rem] text-taupe leading-[1.75]">
            <p>
              Strategy. Client architecture. Pricing. Voice. Final decisions.
              Maria-Ines conducts every call, builds every system, and runs
              every VIP day personally. She is the architect, not a label on
              someone else&rsquo;s assembly line.
            </p>
            <p>
              AI does not decide what gets built, who it gets built for, or
              what standards it must meet. A human does. Every time.
            </p>
          </div>
        </div>

        {/* ── Retrieval vs. training ── */}
        <div className="border-t border-hair-olive pt-10 mb-16">
          <p className="kicker mb-6">Retrieval vs. training</p>
          <div className="max-w-[40em] space-y-5 text-[1.08rem] text-taupe leading-[1.75]">
            <p>
              Envisioned content is discoverable and citable by AI answer
              engines. Retrieval is welcomed. Attribution matters.
            </p>
            <p>
              This site does <strong className="text-ink">not</strong> consent
              to model training. The technical policy:{' '}
              <code className="text-[0.92em] bg-canvas-soft px-2 py-0.5 rounded">
                search=yes, ai-input=yes, ai-train=no
              </code>
              .
            </p>
            <p>
              GPTBot, ClaudeBot, Google-Extended, and PerplexityBot are allowed
              for retrieval. If you are building a model and scraping this site
              for training data, you do not have permission.
            </p>
          </div>
        </div>

        {/* ── Client data ── */}
        <div className="border-t border-hair-olive pt-10 mb-16">
          <p className="kicker mb-6">Client data</p>
          <div className="max-w-[40em] space-y-5 text-[1.08rem] text-taupe leading-[1.75]">
            <p>
              Client data is processed through AI to build their
              infrastructure. It is never shared across clients, never used in
              marketing without explicit permission, and never uploaded to
              training datasets.
            </p>
            <p>
              Each client&rsquo;s codified intelligence belongs to them. Full
              stop.
            </p>
          </div>
        </div>

        {/* ── Disclosure standard ── */}
        <div className="border-t border-hair-olive pt-10 mb-16">
          <p className="kicker mb-6">Disclosure standard</p>
          <div className="max-w-[40em] space-y-5 text-[1.08rem] text-taupe leading-[1.75]">
            <p>
              There is no blanket &ldquo;made with AI&rdquo; disclaimer
              plastered across this site. This page is the standing disclosure.
              If you want to know whether a specific piece used AI, ask. The
              answer is honest and usually yes.
            </p>
          </div>
        </div>

        {/* ── The position ── */}
        <div className="border-t border-hair-olive pt-10 mb-16">
          <p className="kicker mb-6">The position</p>
          <div className="max-w-[40em] space-y-5 text-[1.08rem] text-taupe leading-[1.75]">
            <p>
              AI is not a productivity hack. It is a mirror that forces you to
              decide who you are when effort no longer proves worth.
            </p>
            <p>
              For the first time in history, leverage is not reserved for
              companies with massive teams and budgets. Access to that leverage
              matters most to the people systems usually fail. Refusing AI is a
              privilege most women building businesses do not have. Using it
              without refusals is how brilliant work goes generic.
            </p>
            <p>Engage consciously. Keep your no.</p>
          </div>
        </div>

        {/* ── Footer link ── */}
        <div className="border-t border-hair pt-10">
          <Link
            href="/contact"
            className="text-[1.02rem] italic text-olive hover:text-olive-deep transition-colors"
          >
            Get in touch &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
