import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Transparency — Envisioned',
  description:
    'Who holds the judgement, how AI supports the work, and the policy on training, retrieval and attribution. The standing disclosure.',
};

/**
 * Vendor names deliberately removed (MI, 2026-08-27).
 *
 * The page used to name the specific model and image tool. Checked against the
 * EU AI Act: Article 50 requires disclosing THAT content is AI-generated, never
 * WHICH system produced it, and the text obligation carries an exemption where
 * the content has had human review and a person holds editorial responsibility.
 * So naming vendors was voluntary. It is now stated as a choice, with the thing
 * that actually matters (who holds the judgement) said out loud instead.
 *
 * Voice: first person throughout. The page previously slid between "I build"
 * and "Maria-Ines conducts", which read as though someone else wrote it.
 */
export default function AITransparencyPage() {
  return (
    <main className="min-h-screen px-6 pt-40 pb-32">
      <div className="max-w-[1140px] mx-auto w-full">
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

        {/* ── Whose judgement ── */}
        <div className="border-t border-hair-olive pt-10 mb-16">
          <p className="kicker mb-6">Whose judgement this is</p>
          <div className="max-w-[40em] space-y-5 text-[1.08rem] text-taupe leading-[1.75]">
            <p>
              Before the AI question, the one that actually matters: whose
              thinking are you reading?
            </p>
            <p>
              I spent years in international consulting, managing projects worth
              millions, including work with the Australian Red Cross. Then a
              decade in the online space as a brand and personal brand
              photographer, and as a strategist for founder-led businesses.
            </p>
            <p>
              Twenty years of deciding what matters in the frame, and years
              before that of running programmes where getting it wrong had
              consequences. That is where the judgement in this work comes from.
            </p>
          </div>
        </div>

        {/* ── My ideas are my own ── */}
        <div className="border-t border-hair-olive pt-10 mb-16">
          <p className="kicker mb-6">My ideas are my own</p>
          <div className="max-w-[40em] space-y-5 text-[1.08rem] text-taupe leading-[1.75]">
            <p>
              The thinking, the positioning, the frameworks, the opinions, the
              decisions about what is worth saying at all. Mine. Every one of
              them existed before the tool and would survive without it.
            </p>
            <p className="text-ink">
              AI did not give me a point of view. It found me with one already.
            </p>
          </div>
        </div>

        {/* ── How AI supports the work ── */}
        <div className="border-t border-hair-olive pt-10 mb-16">
          <p className="kicker mb-6">How AI supports the work</p>
          <div className="max-w-[40em] space-y-5 text-[1.08rem] text-taupe leading-[1.75]">
            <p>
              Everything published here starts as my own point of view. Usually
              spoken out loud, argued through, or written badly first. AI helps
              me extract it, draft from it, and shape it so it is readable by
              people and retrievable by machines.
            </p>
            <p className="text-ink">
              The judgement is extracted from me. It is not generated for me.
            </p>
            <p>
              It also does the work that never needed a human in the first
              place: research, scheduling, data analysis, first drafts of the
              parts nobody enjoys, and the build work inside client systems.
              Images on this site are AI-generated and reviewed against a
              twelve-point creative direction checklist before anything is
              published.
            </p>
          </div>
        </div>

        {/* ── What stays human ── */}
        <div className="border-t border-hair-olive pt-10 mb-16">
          <p className="kicker mb-6">What stays human</p>
          <div className="max-w-[40em] space-y-5 text-[1.08rem] text-taupe leading-[1.75]">
            <p>
              Strategy. Client architecture. Pricing. Voice. Final decisions. I
              conduct every call, build every system and run every VIP day
              myself. I am the architect, not a label on someone else&rsquo;s
              assembly line.
            </p>
            <p>
              AI does not decide what gets built, who it gets built for, or what
              standards it has to meet. I do. Every time.
            </p>
          </div>
        </div>

        {/* ── On naming tools ── */}
        <div className="border-t border-hair-olive pt-10 mb-16">
          <p className="kicker mb-6">On naming tools</p>
          <div className="max-w-[40em] space-y-5 text-[1.08rem] text-taupe leading-[1.75]">
            <p>
              I do not publish a list of which models I use, and no rule
              requires me to. Transparency law asks whether content is
              AI-assisted and whether a human is accountable for it. It does not
              ask for the brand name on the tool.
            </p>
            <p>
              The tools change every few months anyway. What does not change is
              who holds the judgement and who reviews the work before it reaches
              you. Both answers are on this page.
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
              Retrieval crawlers are allowed. If you are building a model and
              scraping this site for training data, you do not have permission.
            </p>
          </div>
        </div>

        {/* ── Client data ── */}
        <div className="border-t border-hair-olive pt-10 mb-16">
          <p className="kicker mb-6">Client data</p>
          <div className="max-w-[40em] space-y-5 text-[1.08rem] text-taupe leading-[1.75]">
            <p>
              Client data is processed through AI to build their infrastructure.
              It is never shared across clients, never used in marketing without
              explicit permission, and never uploaded to training datasets.
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
