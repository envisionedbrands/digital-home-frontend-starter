import Link from 'next/link';

const CITC_URL = 'https://codifiedinthecity.com';

export default function HomePage() {
  return (
    <main className="px-6 pt-44 pb-24">
      <div className="max-w-[1140px] mx-auto w-full">
        {/* ── 3 · Hero ─────────────────────────────────────────── */}
        <section className="mb-32">
          <p className="kicker mb-8">For founder-led businesses built on real expertise</p>

          <h1 className="display text-4xl md:text-6xl xl:text-[5.2rem] text-ink mb-10 max-w-[14em] leading-[1.05]">
            Let your business carry more of what you know.
          </h1>

          <p className="text-xl md:text-[1.45rem] text-ink-soft max-w-[36em] leading-[1.7] mb-6">
            You have spent years developing the judgement behind your work.
          </p>
          <p className="text-lg md:text-[1.2rem] text-taupe max-w-[40em] leading-[1.75] mb-12">
            I help get it out of your head and into the places your clients, team and
            business need it most, so they can move faster, your standards stay intact,
            and everything stops waiting for you.
          </p>

          <div className="flex flex-wrap items-center gap-8 mb-6">
            <Link
              href="/founder-access"
              className="text-[0.95rem] bg-olive text-canvas px-8 py-3 hover:bg-olive-deep transition-colors tracking-[0.04em]"
            >
              Take the Founder Access Diagnostic
            </Link>
            <a
              href={CITC_URL}
              className="text-[1.02rem] text-olive underline underline-offset-4 hover:text-olive-deep transition-colors"
            >
              Explore Codified in the City
            </a>
          </div>
          <p className="kicker text-[0.62rem] text-ink/50">
            For established founders, mentors and programme leaders whose expertise is already proven.
          </p>
        </section>

        {/* ── 4 · Recognition ──────────────────────────────────── */}
        <section id="the-work" className="border-t border-hair-olive pt-16 mb-32 scroll-mt-28">
          <h2 className="display text-3xl md:text-5xl text-ink mb-10 max-w-[18em]">
            You are still the place where the real work happens.
          </h2>
          <div className="max-w-[40em] space-y-6 text-[1.15rem] text-ink-soft leading-[1.8]">
            <p>
              Your clients have the course.
              <br />
              Your team has the SOP.
              <br />
              Your AI has the prompt.
            </p>
            <p>
              Then something needs context, taste, a decision or an exception… and it
              comes straight back to you.
            </p>
            <p>
              Because the valuable part of your business lives in the things you do
              without thinking:
            </p>
            <p className="text-ink">
              The question you ask.
              <br />
              The pattern you spot.
              <br />
              The standard you refuse to lower.
              <br />
              The way you know what matters first.
            </p>
            <p>
              Until that becomes usable outside you, every new client, offer and idea
              quietly asks for more of you.
            </p>
          </div>
        </section>

        {/* ── 5 · The larger opportunity ───────────────────────── */}
        <section className="border-t border-hair-olive pt-16 mb-32">
          <h2 className="display text-3xl md:text-5xl text-ink mb-10 max-w-[18em]">
            There is more of your business available than you can currently use.
          </h2>
          <div className="max-w-[40em] space-y-6 text-[1.15rem] text-ink-soft leading-[1.8] mb-14">
            <p>
              It is sitting in years of calls, programmes, content, client history,
              folders and half-finished documents.
            </p>
            <p>It is also sitting inside your judgement.</p>
            <p>
              The part that cannot be found in a checklist because it appears when you
              hear the context and immediately know what is really going on.
            </p>
            <p>When we make that intelligence explicit and give it somewhere useful to work:</p>
          </div>

          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 border border-hair bg-hair">
            {[
              ['Clients move faster', 'They can access more of your framework while they are implementing, instead of waiting until the next call to discover they took the wrong turn.'],
              ['Your team carries more', 'They have the context, standards and boundaries behind the task, so fewer decisions return to you by default.'],
              ['Your body of work becomes usable', 'Years of ideas, teaching and client conversations become material you can search, connect, reuse and build from.'],
              ['AI stops guessing who you are', 'The output improves because the system finally has your actual voice, examples, decisions and method to work from.'],
              ['You get to lead', 'Your attention can return to direction, relationships and the work that genuinely requires you.'],
            ].map(([title, body]) => (
              <div key={title} className="bg-canvas-soft px-8 py-10">
                <span className="kicker block mb-5">{title}</span>
                <p className="text-[1.02rem] text-taupe leading-[1.7]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6 · Featured offer ───────────────────────────────── */}
        <section className="border-t border-hair-olive pt-16 mb-32">
          <p className="kicker mb-8">The hero experience</p>
          <h2 className="display text-4xl md:text-6xl text-ink mb-8">Codified in the City</h2>
          <div className="max-w-[40em] space-y-6 text-[1.15rem] text-ink-soft leading-[1.8]">
            <p className="text-xl md:text-[1.35rem] text-ink">
              One day to get the intelligence behind your business out of your head and
              working where it can create the most immediate value.
            </p>
            <p>
              Before we meet, I study what you have built and where your presence is
              still carrying too much.
            </p>
            <p>
              In the city, we extract the judgement behind the work, organise what
              matters and build the first live system around the priority that will move
              the most weight.
            </p>
            <p>That could be:</p>
            <ul className="list-disc pl-6 space-y-2 text-[1.08rem]">
              <li>a client implementation tool built around your framework</li>
              <li>a content engine that can work with years of ideas</li>
              <li>a command centre that surfaces what needs your attention before it becomes urgent</li>
              <li>a clearer way for your team to make routine decisions</li>
              <li>a system that turns accumulated client history into something you can actually act on</li>
            </ul>
            <p className="text-ink">Then we take the long lunch.</p>
            <p>The lunch is part of the method because stepping away is part of the proof.</p>
            <p>
              You return to work that is already running on your real business, with a
              clear order for what comes next.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-8 mb-5">
            <a
              href={CITC_URL}
              className="text-[0.95rem] bg-olive text-canvas px-8 py-3 hover:bg-olive-deep transition-colors tracking-[0.04em]"
            >
              Discover Codified in the City
            </a>
            <a
              href={CITC_URL}
              className="text-[1.02rem] text-olive underline underline-offset-4 hover:text-olive-deep transition-colors"
            >
              Prefer to meet online? Explore Codified Live.
            </a>
          </div>
          <p className="kicker text-[0.62rem] text-ink/50">
            €5,500 + VAT where applicable. Two payments available.
          </p>
        </section>

        {/* ── 7 · Proof ────────────────────────────────────────── */}
        <section className="border-t border-hair-olive pt-16 mb-32">
          <h2 className="display text-3xl md:text-5xl text-ink mb-10 max-w-[18em]">
            What this can look like in a real business
          </h2>
          <div className="max-w-[40em] space-y-6 text-[1.15rem] text-ink-soft leading-[1.8] mb-12">
            <p>
              A programme leader came into her build day with years of frameworks,
              client history and ideas spread across her business.
            </p>
            <p>One of her existing processes had taken roughly 20 hours.</p>
            <p>
              With the right context and structure in place, the new workspace brought
              it down to around 30 minutes.
            </p>
            <p>The time mattered.</p>
            <p>
              What surprised her more was being able to see the business she had already
              built, continue working with it after the day, and spot opportunities
              hidden inside years of client relationships.
            </p>
            <blockquote className="border-l-2 border-olive pl-6 text-ink italic text-xl">
              “This is what I have been wanting for so long.”
            </blockquote>
          </div>

          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 border border-hair bg-hair mb-12">
            {[
              'Approx. 20 hours → approx. 30 minutes for one established process',
              'Existing business intelligence brought into one usable environment',
              'Past high-value client opportunities made easier to see',
              'New ways for clients to implement the founder’s frameworks faster',
            ].map((label) => (
              <div key={label} className="bg-canvas-soft px-7 py-8">
                <p className="text-[0.98rem] text-taupe leading-[1.65]">{label}</p>
              </div>
            ))}
          </div>

          <Link
            href="/contact"
            className="inline-block text-[0.95rem] bg-olive text-canvas px-8 py-3 hover:bg-olive-deep transition-colors tracking-[0.04em]"
          >
            See what we could build in your business
          </Link>
        </section>

        {/* ── 8 · How the work happens ─────────────────────────── */}
        <section className="border-t border-hair-olive pt-16 mb-32">
          <h2 className="display text-3xl md:text-5xl text-ink mb-8 max-w-[18em]">
            The work begins with how you think.
          </h2>
          <div className="max-w-[40em] space-y-6 text-[1.15rem] text-ink-soft leading-[1.8] mb-14">
            <p>A tool can follow instructions.</p>
            <p>
              The quality of the result depends on the judgement, context and standards
              behind those instructions.
            </p>
            <p>That is what we capture first.</p>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            {[
              ['01. We see what is already there', 'Your offers, methods, client work, voice, decisions, content and existing tools. The real business, including the parts that only make sense because you are currently holding them together.'],
              ['02. We find what carries the most weight', 'You do not leave with forty possible projects. We identify the application that will create the most useful movement first.'],
              ['03. We build with your real information', 'The first system is installed around your work, your data and your way of deciding. You see it running before the day ends.'],
              ['04. We map the next chapter', 'You leave knowing what is worth building next, what should remain human, and where your presence has the highest value.'],
            ].map(([title, body]) => (
              <div key={title}>
                <h3 className="display text-xl md:text-2xl text-ink mb-4">{title}</h3>
                <p className="text-[1.05rem] text-taupe leading-[1.75] max-w-[34em]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 9 · Ways to work together ────────────────────────── */}
        <section id="ways-to-work" className="border-t border-hair-olive pt-16 mb-32 scroll-mt-28">
          {/* Chronicle-style service table (chronicle.northfolk.co/services):
              centred intro, a double rule, numbered hairline-divided columns,
              price + boxed arrow as the footer row. Copy and prices unchanged —
              only the layout moved. */}
          <div className="text-center">
            <p className="kicker mb-6">Ways to work</p>
            <h2 className="display text-3xl md:text-5xl text-ink">Begin where you are.</h2>
          </div>

          {/* Double rule */}
          <div className="mt-14 border-t-2 border-ink" />
          <div className="mt-[3px] border-t border-ink/40" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {/* ── One · The Integration Map ── */}
            <div className="flex flex-col py-10 pr-6">
              <div className="flex items-start justify-between gap-3">
                <p className="kicker text-[0.62rem] uppercase tracking-[0.28em] text-ink/80">One</p>
                <span className="display -rotate-3 text-[0.95rem] italic text-olive">Begin here</span>
              </div>
              <div className="mt-4 flex min-h-[7rem] items-start border-b border-hair pb-6 sm:min-h-[8rem]">
                <h3 className="display text-2xl md:text-[1.7rem] leading-[1.15] text-ink">The Integration Map</h3>
              </div>
              <div className="pt-6">
                <p className="text-[1.02rem] text-ink mb-4">
                  See what is making you the bottleneck and what to build first.
                </p>
                <p className="text-[0.98rem] text-taupe leading-[1.7] mb-4">
                  A paid diagnostic for founders who can feel the weight but do not yet
                  know which system, workflow or body of knowledge should come first.
                </p>
                <p className="text-[0.98rem] text-taupe leading-[1.7] mb-4">
                  You receive a written map you can keep, whether or not we continue.
                  Credited in full toward Codified in the City or Codified Live within 60 days.
                </p>
              </div>
              <Link
                href="/contact"
                className="group mt-auto flex items-center justify-between gap-4 pt-6"
                title="Start with the Map"
              >
                <span className="kicker text-[0.68rem] uppercase tracking-[0.22em] text-ink">€1,500</span>
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center border border-ink text-ink transition-colors group-hover:bg-ink group-hover:text-canvas">
                  →
                </span>
              </Link>
            </div>

            {/* ── Two · Codified in the City / Codified Live ── */}
            <div className="flex flex-col py-10 pr-6 sm:border-l sm:border-hair sm:pl-8">
              <p className="kicker text-[0.62rem] uppercase tracking-[0.28em] text-ink/80">Two</p>
              <div className="mt-4 flex min-h-[7rem] items-start border-b border-hair pb-6 sm:min-h-[8rem]">
                <h3 className="display text-2xl md:text-[1.7rem] leading-[1.15] text-ink">
                  Codified in the City / Codified Live
                </h3>
              </div>
              <div className="pt-6">
                <p className="text-[1.02rem] text-ink mb-4">
                  Get the foundation out of your head and the first working system live in one day.
                </p>
                <p className="text-[0.98rem] text-taupe leading-[1.7] mb-4">
                  In person in selected cities, or online with remote screen control.
                </p>
              </div>
              <a
                href={CITC_URL}
                className="group mt-auto flex items-center justify-between gap-4 pt-6"
                title="Explore the build day"
              >
                <span className="kicker text-[0.68rem] uppercase tracking-[0.22em] text-ink">€5,500</span>
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center border border-ink text-ink transition-colors group-hover:bg-ink group-hover:text-canvas">
                  →
                </span>
              </a>
            </div>

            {/* ── Three · The Atelier ── */}
            <div className="flex flex-col py-10 pr-6 lg:border-l lg:border-hair lg:pl-8">
              <p className="kicker text-[0.62rem] uppercase tracking-[0.28em] text-ink/80">Three</p>
              <div className="mt-4 flex min-h-[7rem] items-start border-b border-hair pb-6 sm:min-h-[8rem]">
                <h3 className="display text-2xl md:text-[1.7rem] leading-[1.15] text-ink">The Atelier</h3>
              </div>
              <div className="pt-6">
                <p className="text-[1.02rem] text-ink mb-4">
                  Build the business brain and your first fitted system over eight weeks.
                </p>
                <p className="text-[0.98rem] text-taupe leading-[1.7] mb-4">
                  A small live working studio for founders who want the extraction and
                  build process in a group environment, with six working sessions and a
                  clear plan for what comes next.
                </p>
              </div>
              <Link
                href="/contact"
                className="group mt-auto flex items-center justify-between gap-4 pt-6"
                title="Visit The Atelier"
              >
                <span className="kicker text-[0.68rem] uppercase tracking-[0.22em] text-ink">€2,499</span>
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center border border-ink text-ink transition-colors group-hover:bg-ink group-hover:text-canvas">
                  →
                </span>
              </Link>
            </div>

            {/* ── Four · Codified Studio ── */}
            <div className="flex flex-col py-10 pr-6 sm:border-l sm:border-hair sm:pl-8">
              <p className="kicker text-[0.62rem] uppercase tracking-[0.28em] text-ink/80">Four</p>
              <div className="mt-4 flex min-h-[7rem] items-start border-b border-hair pb-6 sm:min-h-[8rem]">
                <h3 className="display text-2xl md:text-[1.7rem] leading-[1.15] text-ink">Codified Studio</h3>
              </div>
              <div className="pt-6">
                <p className="text-[1.02rem] text-ink mb-4">
                  Let your video move from phone to finished, branded content without
                  becoming another editing project.
                </p>
                <p className="text-[0.98rem] text-taupe leading-[1.7] mb-4">
                  A customised video system that tightens the master, creates vertical
                  clips, applies your captions and sends the results to Telegram for
                  approval.
                </p>
              </div>
              <Link
                href="/contact"
                className="group mt-auto flex items-center justify-between gap-4 pt-6"
                title="Explore Codified Studio"
              >
                <span className="kicker text-[0.68rem] uppercase tracking-[0.22em] text-ink">From €1,499</span>
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center border border-ink text-ink transition-colors group-hover:bg-ink group-hover:text-canvas">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── 10 · Belief ──────────────────────────────────────── */}
        <section className="border-t border-hair-olive pt-16 mb-32">
          <h2 className="display text-3xl md:text-5xl text-ink mb-10 max-w-[18em]">
            Your judgement is the part worth carrying.
          </h2>
          <div className="max-w-[40em] space-y-6 text-[1.15rem] text-ink-soft leading-[1.8]">
            <p>AI has made output abundant.</p>
            <p>
              That makes context, taste and judgement more important, because the
              technology will carry whatever has been built into it.
            </p>
            <p>
              I believe access to powerful tools should not belong only to companies
              with large teams, technical departments and budgets most founders will
              never have.
            </p>
            <p>
              I believe people have agency. We can use AI consciously without handing it
              responsibility for the decisions that should remain human.
            </p>
            <p>
              And I believe your years of experience should become more usable as
              technology advances, rather than being flattened into the same output as
              everyone else.
            </p>
            <p className="text-ink">That is the work underneath every system I build.</p>
          </div>
        </section>

        {/* ── 11 · About ───────────────────────────────────────── */}
        <section className="border-t border-hair-olive pt-16 mb-32">
          <p className="kicker mb-8">The person inside your business, for a while</p>
          <h2 className="display text-3xl md:text-5xl text-ink mb-10">I’m Maria-Ines.</h2>
          <div className="max-w-[40em] space-y-6 text-[1.15rem] text-ink-soft leading-[1.8] mb-10">
            <p>
              My background spans more than 20 years of international development work
              across 30+ countries, alongside decades in photography, brand strategy and
              the practical use of AI.
            </p>
            <p>Which may sound like several careers (it has occasionally felt like several careers).</p>
            <p className="text-ink">The thread is systems and people.</p>
            <p>
              I notice what holds something together, what happens when it fails, and
              how much valuable knowledge lives inside the person doing the work.
            </p>
            <p>That is how I enter a founder-led business.</p>
            <p>
              Part strategist, part excavator, part builder, and usually the person
              asking the question you did not realise was the whole thing.
            </p>
            <p>
              The useful material rarely appears in a perfect questionnaire answer. It
              comes out in the side comment, the exception, the story you nearly skip
              and the decision you make so instinctively you forgot it was a method.
            </p>
            <p>I catch those pieces and build with them.</p>
          </div>
          <Link
            href="/about"
            className="inline-block text-[0.92rem] border border-ink px-7 py-2.5 text-ink hover:bg-ink hover:text-canvas transition-colors tracking-[0.04em]"
          >
            More about Maria-Ines
          </Link>
        </section>

        {/* ── 12 · Why now ─────────────────────────────────────── */}
        <section className="border-t border-hair-olive pt-16 mb-32">
          <h2 className="display text-3xl md:text-5xl text-ink mb-10 max-w-[18em]">
            Your business is being interpreted in more places than you can personally enter.
          </h2>
          <div className="max-w-[40em] space-y-6 text-[1.15rem] text-ink-soft leading-[1.8]">
            <p>
              People still find you through stories, recommendations and the feeling
              your brand creates.
            </p>
            <p>
              They also ask AI who to trust, use tools to compare options, and expect
              intelligent support inside the programmes they buy.
            </p>
            <p>
              This is one more reason to make your method, language and standards
              explicit.
            </p>
            <p>It is supporting context, not the centre of the work.</p>
            <p className="text-ink">
              The centre is still you: what you know, how you decide and the quality you
              want the business to carry.
            </p>
          </div>
        </section>

        {/* ── 13 · Final call to action ────────────────────────── */}
        <section className="border-t border-hair-olive pt-16">
          <div className="bg-ink px-8 py-16 md:py-20 text-center">
            <p className="display mx-auto max-w-3xl text-3xl md:text-5xl leading-tight text-canvas mb-6">
              What would become possible if your business could use more of what you know?
            </p>
            <p className="text-canvas/70 text-lg mb-3">
              Choose Codified in the City when you are ready to build.
            </p>
            <p className="text-canvas/70 text-lg mb-10">
              Choose The Integration Map when you need to see the order first.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
              <a
                href={CITC_URL}
                className="text-[0.95rem] bg-canvas text-ink px-8 py-3 hover:bg-canvas/85 transition-colors tracking-[0.04em]"
              >
                Explore Codified in the City
              </a>
              <Link
                href="/contact"
                className="kicker border border-canvas px-8 py-3.5 text-[0.68rem] uppercase tracking-[0.24em] text-canvas transition-colors hover:bg-canvas hover:text-ink"
              >
                Start with The Integration Map
              </Link>
            </div>
            <p className="text-canvas/60 text-[1.02rem]">
              Your business has already learned so much from you. Let’s make sure it can use it.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
