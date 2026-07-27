import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 pt-40 pb-32 flex flex-col justify-center">
      <div className="max-w-[1140px] mx-auto w-full">
        {/* Beat 1 — the moment */}
        <p className="kicker mb-8">Envisioned Systems · AI infrastructure for founders</p>

        <h1 className="display text-4xl md:text-6xl xl:text-[5.5rem] text-ink mb-10 max-w-[16em]">
          I was standing in a grocery line when I realized my business was running without me.
        </h1>

        <p className="text-xl md:text-[1.55rem] text-ink-soft max-w-[38em] leading-[1.75] mb-8">
          Nothing was on fire. Nobody was waiting. The work was moving, in my
          voice, to my standards, and I was choosing tomatoes.
        </p>

        <p className="text-lg md:text-[1.2rem] text-taupe max-w-[40em] leading-[1.75] mb-16">
          Twenty years running multi-million-dollar programs across thirty
          countries taught me what breaks when everything depends on one person.
          Now I build AI infrastructure that codifies how you think, so your
          standards hold in every room you&rsquo;re not in.
        </p>

        <div className="flex items-center gap-8 mb-28">
          <Link
            href="/services"
            className="text-[0.95rem] bg-olive text-canvas px-8 py-3 hover:bg-olive-deep transition-colors tracking-[0.04em]"
          >
            See the rooms
          </Link>
          <Link
            href="/blog"
            className="text-[1.02rem] italic text-olive hover:text-olive-deep transition-colors"
          >
            Read the essays &rarr;
          </Link>
        </div>

        {/* Beat 2 — the pattern, empowered */}
        <div className="border-t border-hair-olive pt-14 mb-24">
          <p className="kicker mb-8">I · The pattern</p>
          <h2 className="display text-3xl md:text-5xl text-ink mb-8 max-w-[18em]">
            &ldquo;Can you take a quick look?&rdquo;
          </h2>
          <div className="max-w-[40em] space-y-6 text-[1.15rem] text-ink-soft leading-[1.8]">
            <p>
              You know that message. You open the doc. The facts are right. The
              structure is fine. And it still misses the thing you would have
              caught in four seconds. So you fix the opening, repair the tone,
              and their quick look quietly becomes your evening. Again.
            </p>
            <p>
              The same thing happens with every AI tool you&rsquo;ve tried. The
              draft comes back competent and completely unlike you. Not wrong.
              Generic.
            </p>
            <p>
              Let&rsquo;s be crystal clear about why. <strong>You&rsquo;re not
              generic. Your output is.</strong> Everything that makes your work
              yours (the judgment, the standards, the &ldquo;technically correct
              but absolutely not us&rdquo;) has never been written down anywhere
              a person or a machine can read it. So the tools fill in the blanks
              with everyone else.
            </p>
            <p>
              You didn&rsquo;t build it wrong. You built it the only way you
              could: on your own judgment, faster than any process could follow.
              Not a talent problem. Not a prompt problem. An extraction problem.
              And extraction is work that can simply be done.
            </p>
          </div>
        </div>

        {/* Beat 3 — the tax */}
        <div className="grid gap-px sm:grid-cols-3 mb-24 border border-hair bg-hair">
          <div className="bg-canvas-soft px-8 py-10">
            <span className="kicker block mb-6">The Reconstruction Tax</span>
            <p className="text-[1.05rem] text-taupe leading-[1.7]">
              Every re-explained method, every rewritten &ldquo;final
              draft,&rdquo; every system that breaks the moment you look away.
              Roughly &euro;9,750 a year spent rebuilding your own genius from
              memory.
            </p>
          </div>
          <div className="bg-canvas-soft px-8 py-10">
            <span className="kicker block mb-6">The Loop</span>
            <p className="text-[1.05rem] text-taupe leading-[1.7]">
              You build a process to replace yourself. It works, briefly. The
              business changes. The process breaks. You fix it and call it
              optimization. The exit is not a better process; it is codified
              thinking.
            </p>
          </div>
          <div className="bg-canvas-soft px-8 py-10">
            <span className="kicker block mb-6">Two readers</span>
            <p className="text-[1.05rem] text-taupe leading-[1.7]">
              Your brand has two readers now. Humans still look for resonance.
              Machines look for language they can understand, retrieve, and
              trust. Codification makes you legible to both.
            </p>
          </div>
        </div>

        {/* Beat 4 — the hinge (the page's one reframe) */}
        <div className="border-t border-hair-olive pt-14 mb-24">
          <p className="kicker mb-8">II · The reframe</p>
          <h2 className="display text-3xl md:text-5xl text-ink mb-8 max-w-[18em]">
            You don&rsquo;t have an AI problem. You have an identity problem.
          </h2>
          <div className="max-w-[40em] space-y-6 text-[1.15rem] text-ink-soft leading-[1.8]">
            <p>
              When AI can do 80% of the work that used to prove your worth, you
              get to decide what the remaining 20% actually is. That decision has
              a practical shape: codification turns your voice, standards,
              methodology, and offers into infrastructure that can travel.
              Documented thinking, not procedures. Written once. Read by every
              person, tool, and agent that touches your business.
            </p>
            <p>
              The enterprise version needs a committee: a year of workshops, a
              steering group, a style guide nobody follows. You have exactly one
              source of truth, and she&rsquo;s reading this page. Codifying one
              brilliant mind is a day&rsquo;s work. The smaller the business, the
              better this works. Couture exists for the same reason. Su misura.
              Made to measure.
            </p>
          </div>
        </div>

        {/* Beat 6 — proof register */}
        <div className="border-t border-hair-olive pt-14 mb-24">
          <p className="kicker mb-8">III · The proof</p>
          <h2 className="display text-3xl md:text-5xl text-ink mb-8 max-w-[18em]">
            The test of this work is a long lunch.
          </h2>
          <div className="max-w-[40em] space-y-6 text-[1.15rem] text-ink-soft leading-[1.8]">
            <p>
              Not a dashboard demo. A table, no phones, while the business runs.
              Recent builds carry a mentor&rsquo;s method into the gaps between
              her calls (not a chatbot; it refuses questions she&rsquo;d refuse),
              prepare a coach the way she&rsquo;d prepare herself, and show a
              founder where every client actually is, so she chooses when to
              step in.
            </p>
            <p>
              The second build went faster than the first. The third faster
              still. That is what infrastructure means: the pattern exists, so
              nothing starts from zero.
            </p>
          </div>
        </div>

        {/* Beat 9 — the door */}
        <div className="border-t border-hair-olive pt-14">
          <p className="kicker mb-8">IV · The door</p>
          <h2 className="display text-3xl md:text-5xl text-ink mb-8 max-w-[18em]">
            If any of this read like your Tuesday.
          </h2>
          <p className="text-[1.15rem] text-ink-soft max-w-[40em] leading-[1.8] mb-10">
            The Integration Map is open any day of the year; start there and the
            map tells us both what&rsquo;s true. Or don&rsquo;t decide anything
            yet. The essays are free, and the people who eventually sit at my
            table usually read for months first. I count on it.
          </p>
          <div className="flex items-center gap-8">
            <Link
              href="/services"
              className="text-[0.95rem] bg-olive text-canvas px-8 py-3 hover:bg-olive-deep transition-colors tracking-[0.04em]"
            >
              Begin the reading
            </Link>
            <Link
              href="/blog"
              className="text-[1.02rem] italic text-olive hover:text-olive-deep transition-colors"
            >
              Read the essays &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
