import Image from 'next/image';

/**
 * Homepage — the Chronicle idiom (chronicle.northfolk.co), Envisioned's system.
 * Per DECISIONS #010 the site's faces are Newsreader + DM Sans, oxblood on
 * warm ivory — Chronicle contributes the ARCHITECTURE: black numbered
 * masthead, heavy rules, numbered chapters, scrolling ticker bands, act-break
 * photography. All copy is Maria-Ines's, verbatim.
 *
 * Self-contained: fonts + keyframes load from the <style> block below so the
 * rest of the site (old token system) is untouched. The global NavBar returns
 * null on "/" — this page carries its own masthead.
 */

const MAP_MAILTO = 'mailto:hello@mariaines.co?subject=The%20Integration%20Map';
const CITC_MAILTO = 'mailto:hello@mariaines.co?subject=Codified%20in%20the%20City';
const RES_MAILTO = 'mailto:hello@mariaines.co?subject=The%20Residency';
const EG_MAILTO = 'mailto:hello@mariaines.co?subject=Embedded%20Genius';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=DM+Sans:wght@300;400;500;600&display=swap');
.ch { --ivory:#F6F0E7; --ink:#2C2522; --stone:#D8CEC2; --ox:#8B1E32; --char:#36312F;
  font-family:'DM Sans',sans-serif; background:var(--ivory); color:var(--ink); }
.ch .nr { font-family:'Newsreader',Georgia,serif; font-weight:400; letter-spacing:-0.01em; }
.ch .nr em { font-style:italic; font-weight:300; }
.ch .lbl { font-family:'DM Sans',sans-serif; font-weight:500; text-transform:uppercase; letter-spacing:0.22em; font-size:0.72rem; }
.ch .num { font-family:'Newsreader',Georgia,serif; font-weight:300; }
@keyframes ch-ticker { from { transform:translateX(0); } to { transform:translateX(-50%); } }
.ch .ticker-track { display:flex; width:max-content; animation:ch-ticker 36s linear infinite; }
.ch .heavy { border-top:3px solid var(--ink); position:relative; }
.ch .heavy::after { content:''; position:absolute; left:0; right:0; top:5px; border-top:1px solid var(--ink); }
`;

function Rule() {
  return <div className="heavy mx-auto max-w-[1360px]" />;
}

function ChapterHead({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1360px] px-6 pt-6 flex items-baseline justify-between">
      <span className="lbl text-[color:var(--ox)]">{children}</span>
      <span className="num text-[2rem] leading-none text-[color:var(--ink)]/70">{n}</span>
    </div>
  );
}

function Ticker({ items, dark = false }: { items: string[]; dark?: boolean }) {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="nr flex items-center whitespace-nowrap text-[1.55rem] md:text-[1.9rem] px-2">
          {t}
          <span aria-hidden="true" className={`mx-6 inline-block h-1.5 w-1.5 rounded-full ${dark ? 'bg-[#F6F0E7]/60' : 'bg-[color:var(--ox)]'}`} />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`overflow-hidden border-y py-5 ${dark ? 'bg-[color:var(--char)] text-[#F6F0E7] border-transparent' : 'border-[color:var(--ink)] text-[color:var(--ink)]'}`}>
      <div className="ticker-track">{row('a')}{row('b')}</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="ch">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── Masthead — black band, numbered nav ─────────────────────── */}
      <header className="bg-[color:var(--char)] text-[#F6F0E7]">
        <div className="mx-auto flex h-[64px] max-w-[1360px] items-center justify-between px-6">
          <a href="#top" className="nr text-[1.15rem] tracking-tight">Envisioned Brands</a>
          <nav className="hidden items-center gap-8 lg:flex">
            {[
              ['01', 'Founder Intelligence', '#founder-intelligence'],
              ['02', 'Codified in the City', '#citc'],
              ['03', 'Ways to Work', '#ways-to-work'],
              ['04', 'About', '#about'],
            ].map(([n, label, href]) => (
              <a key={label} href={href} className="lbl flex items-baseline gap-2 text-[#F6F0E7]/85 transition-colors hover:text-[#F6F0E7]">
                <span className="text-[0.6rem] text-[#F6F0E7]/50">{n}</span>
                {label}
              </a>
            ))}
          </nav>
          <a href={MAP_MAILTO} className="lbl bg-[color:var(--ox)] px-5 py-2.5 text-[#F6F0E7] transition-opacity hover:opacity-90">
            Start with the Map
          </a>
        </div>
      </header>

      <main id="top">
        {/* ── 01 · Hero ─────────────────────────────────────────────── */}
        <section id="founder-intelligence" className="px-6 pt-24 pb-16">
          <div className="mx-auto max-w-[1360px]">
            <h1 className="nr max-w-[13em] text-[3rem] leading-[1.04] md:text-[4.6rem]">
              Your business is already sitting on <em>extraordinary value.</em>
            </h1>
            <p className="mt-10 max-w-[36em] text-[1.15rem] leading-[1.7] md:text-[1.3rem]">
              We find it, organise it, and put it to work — so you, your team, your
              clients and AI can use more of what you&rsquo;ve spent years creating.
            </p>
          </div>
        </section>

        <Ticker items={[
          'Years of ideas.', 'Client conversations.', 'Methodologies.', 'Decisions.',
          'Workshops.', 'Content.', 'Frameworks.',
          'Patterns you notice without even realising you notice them anymore.',
        ]} />

        <section className="px-6 py-20">
          <div className="mx-auto grid max-w-[1360px] items-end gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div className="nr text-[1.7rem] leading-[1.35] md:text-[2.1rem]">
              <p>You&rsquo;ve already done the hard part.</p>
              <p>You built the intelligence.</p>
              <p className="mt-6">The problem?</p>
              <p>Most of it is sitting there doing <em className="text-[color:var(--ox)]">remarkably little.</em></p>
            </div>
            <div className="flex flex-col items-start gap-8 lg:items-end">
              <Image src="/img/hero-desk.jpg" alt="Desk with notebook and coffee in warm light" width={640} height={460} className="w-full max-w-[560px] object-cover" />
              <a href={CITC_MAILTO} className="lbl flex items-center gap-2 text-[color:var(--ink)] transition-colors hover:text-[color:var(--ox)]">
                Explore Codified in the City <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <div className="bg-[color:var(--char)] py-6 text-center">
          <p className="nr text-[1.4rem] text-[#F6F0E7] md:text-[1.7rem]">Founder intelligence, <em>made usable.</em></p>
          <p className="lbl mt-2 text-[#F6F0E7]/50">E / B</p>
        </div>

        {/* ── 02 ────────────────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="02">Before you create more</ChapterHead>
        <section className="px-6 pt-12 pb-20">
          <div className="mx-auto max-w-[1360px]">
            <h2 className="nr max-w-[16em] text-[2.4rem] leading-[1.08] md:text-[3.4rem]">
              Before you create more with AI, find out what you <em>already own.</em>
            </h2>
            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr]">
              <div className="space-y-5 text-[1.08rem] leading-[1.75]">
                <p>AI has made it absurdly easy to create.</p>
                <ul className="space-y-1.5 pl-5" style={{ listStyleType: 'disc' }}>
                  <li>More content.</li><li>More offers.</li><li>More emails.</li>
                  <li>More PDFs.</li><li>More assistants.</li><li>More agents.</li>
                  <li>More things to add to the enormous pile of things your business already has.</li>
                </ul>
                <p>But more is not automatically better.</p>
                <p>
                  Especially when some of your most original thinking is sitting inside a
                  masterclass you taught four years ago. Or buried in a client call nobody
                  has listened to since. Or scattered across 200 pieces of content. Or
                  hiding inside the way you instinctively make decisions. Or locked inside
                  a methodology your clients understand — but still need you to help them apply.
                </p>
              </div>
              <div className="space-y-5 text-[1.08rem] leading-[1.75]">
                <p>We&rsquo;re in an era of almost infinite generation.</p>
                <p>And somehow the first instruction has been: <em className="nr">generate more.</em></p>
                <p className="nr text-[1.5rem] leading-[1.4] text-[color:var(--ox)]">
                  The valuable material is rarely missing. It is usually scattered.
                </p>
                <p>I&rsquo;m much more interested in another question:</p>
                <p className="nr text-[1.7rem] leading-[1.35]">
                  What have you already created that your business <em>doesn&rsquo;t know how to use?</em>
                </p>
                <p>
                  Because your next offer might already be in there. Your next client
                  experience might already be in there. The missing layer in your
                  methodology might already be in there. The answer to the question your
                  team keeps bringing back to you might already be in there. The thing
                  that finally makes AI useful in your business? Very possibly already in there.
                </p>
                <p>You just haven&rsquo;t been able to see all of it together.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Act break */}
        <div className="relative h-[420px] w-full overflow-hidden">
          <Image src="/img/lived-intelligence.jpg" alt="Working across a table, marking up documents" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#2C2522]/45" />
          <p className="nr absolute inset-x-6 bottom-10 mx-auto max-w-[1360px] text-[1.5rem] text-[#F6F0E7] md:text-[2rem]">
            Judgement. Context. Patterns. <em>The invisible architecture of the work.</em>
          </p>
        </div>

        {/* ── 03 ────────────────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="03">What is distinctly yours</ChapterHead>
        <section className="px-6 pt-12 pb-20">
          <div className="mx-auto max-w-[1360px]">
            <h2 className="nr max-w-[15em] text-[2.4rem] leading-[1.08] md:text-[3.4rem]">
              We don&rsquo;t start with the machine. We start with what is <em>distinctly yours.</em>
            </h2>
            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr]">
              <div className="space-y-5 text-[1.08rem] leading-[1.75]">
                <p>Your business has accumulated far more than documents.</p>
                <ul className="space-y-1.5 pl-5" style={{ listStyleType: 'disc' }}>
                  <li>It has accumulated judgement.</li><li>Context.</li><li>Patterns.</li>
                  <li>Language.</li><li>Standards.</li><li>Exceptions.</li>
                  <li>Client intelligence.</li><li>Ways of solving problems.</li>
                  <li>Things you believe.</li><li>Things you refuse to do.</li>
                  <li>Things experience taught you that no generic prompt could possibly know.</li>
                </ul>
              </div>
              <div className="space-y-5 text-[1.08rem] leading-[1.75]">
                <p>
                  And because you have been living inside that intelligence for years,
                  some of the most valuable parts have become almost invisible to you.
                </p>
                <p>You don&rsquo;t necessarily think: <em className="nr">&ldquo;That&rsquo;s intellectual property.&rdquo;</em></p>
                <p>You think: <em className="nr">&ldquo;Obviously I&rsquo;d do it this way.&rdquo;</em></p>
                <p>Except it isn&rsquo;t obvious.</p>
                <p>It&rsquo;s obvious <em className="nr">to you.</em></p>
                <p className="nr text-[1.5rem] leading-[1.4] text-[color:var(--ox)]">
                  That distinction is where things get interesting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 04 ────────────────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="04">The thinking you earned</ChapterHead>
        <section className="px-6 pt-12 pb-20">
          <div className="mx-auto max-w-[1360px]">
            <h2 className="nr max-w-[17em] text-[2.4rem] leading-[1.08] md:text-[3.2rem]">
              The internet does not need another thousand pieces of AI-generated sameness.
              It needs the thinking you earned <em>before the machine arrived.</em>
            </h2>
            <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_1fr]">
              <ul className="space-y-4 text-[1.08rem] leading-[1.7]">
                {[
                  'The lesson you learned after the client project went spectacularly wrong.',
                  'The pattern you’ve seen across 300 customers.',
                  'The strange question you always ask that gets to the answer faster.',
                  'The framework that evolved slowly across ten years.',
                  'The opinion you arrived at after changing your mind three times.',
                  'The judgement your team keeps borrowing from you.',
                  'The insight you gave spontaneously on a Zoom call and then forgot you ever said.',
                ].map((t) => (
                  <li key={t} className="border-b border-[color:var(--ink)]/15 pb-4">{t}</li>
                ))}
              </ul>
              <div className="space-y-5 text-[1.08rem] leading-[1.75] lg:pt-2">
                <p className="nr text-[1.7rem] leading-[1.35]">That is the good stuff.</p>
                <p className="nr text-[1.7rem] leading-[1.35]">That is what makes the business <em>yours.</em></p>
                <p>And now we have technology capable of helping us do radically more with it.</p>
                <p>Not replace it.</p>
                <p>Not flatten it.</p>
                <p>Not generate a cheaper imitation of it.</p>
                <p className="nr text-[2.2rem] text-[color:var(--ox)]"><em>Use it.</em></p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 05 ────────────────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="05">Not actually new</ChapterHead>
        <section className="px-6 pt-12 pb-16">
          <div className="mx-auto max-w-[1360px]">
            <h2 className="nr max-w-[16em] text-[2.4rem] leading-[1.08] md:text-[3.2rem]">
              What if the most exciting thing AI helps you create next&hellip; <em>isn&rsquo;t actually new?</em>
            </h2>
            <div className="mt-12 grid gap-x-14 gap-y-8 lg:grid-cols-2">
              {[
                'Maybe an old programme becomes an interactive client experience that can guide someone through your methodology while they’re implementing it.',
                'Maybe hundreds of client calls reveal patterns you’ve never had the ability to see across the whole body of work.',
                'Maybe years of content become something you can actually question, connect and build from instead of a graveyard of posts you vaguely remember writing.',
                'Maybe the questions you’ve answered repeatedly become intelligent support your clients can access without waiting five days for your next call.',
                'Maybe the judgement your team borrows from you becomes clear enough that they can make more of those calls themselves.',
                'Maybe something you created years ago becomes commercially valuable again because the technology around it has finally caught up.',
              ].map((t) => (
                <p key={t} className="border-l-2 border-[color:var(--ox)] pl-6 text-[1.08rem] leading-[1.7]">{t}</p>
              ))}
            </div>
            <div className="nr mt-14 max-w-[30em] text-[1.6rem] leading-[1.4]">
              <p>And maybe, once you can see what is actually inside this business&hellip;</p>
              <p className="mt-3">you stop feeling like you need to keep <em>inventing from scratch.</em></p>
            </div>
            <p className="mt-10 max-w-[34em] text-[1.08rem] leading-[1.7] text-[color:var(--ink)]/80">
              Old work becomes newly useful when the surrounding technology catches up.
            </p>
          </div>
        </section>

        <Ticker items={['Find it.', 'Honour it.', 'Make it usable.', 'Then add the leverage.']} dark />

        {/* ── 06 · This is Envisioned ───────────────────────────────── */}
        <Rule />
        <ChapterHead n="06">This is Envisioned</ChapterHead>
        <section className="px-6 pt-12 pb-20">
          <div className="mx-auto max-w-[1360px]">
            <h2 className="nr max-w-[16em] text-[2.4rem] leading-[1.08] md:text-[3.4rem]">This is Envisioned.</h2>
            <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1fr]">
              <div className="space-y-5 text-[1.08rem] leading-[1.75]">
                <p>We work with established founders who have already built something worth making more usable.</p>
                <ul className="space-y-1.5 pl-5" style={{ listStyleType: 'disc' }}>
                  <li>You have expertise.</li><li>You have a body of work.</li>
                  <li>You have methodologies.</li><li>You have years of client experience.</li>
                  <li>You have opinions.</li><li>Standards.</li><li>Decisions.</li>
                  <li>Intellectual property.</li>
                  <li>Probably enough folders to qualify as a small archaeological site.</li>
                </ul>
                <p>What you may not have is a way for the business to see, connect and use all of that intelligence.</p>
                <p className="nr text-[1.5rem] text-[color:var(--ox)]">That is where we come in.</p>
              </div>
              <Image src="/img/city-cafe.jpg" alt="Espresso at a café table in the city" width={720} height={520} className="h-full w-full object-cover" />
            </div>

            <p className="nr mt-20 text-[2rem] md:text-[2.6rem]">Find it. Organise it. <em>Put it to work.</em></p>
            <div className="mt-10 grid gap-px bg-[color:var(--ink)]/20 sm:grid-cols-3">
              <div className="bg-[color:var(--ivory)] pr-8 pt-6 pb-8 sm:pr-10">
                <p className="lbl text-[color:var(--ox)]">We find it</p>
                <div className="mt-4 space-y-4 text-[1.02rem] leading-[1.7]">
                  <p>We go looking across the business you&rsquo;ve already built. Not only at the polished assets.</p>
                  <p>The recordings. The client work. The old programmes. The messy documents. The repeated questions. The exceptions. The decisions. The things you say casually that turn out to explain half your method.</p>
                </div>
              </div>
              <div className="bg-[color:var(--ivory)] px-0 pt-6 pb-8 sm:px-10">
                <p className="lbl text-[color:var(--ox)]">We organise it</p>
                <div className="mt-4 space-y-4 text-[1.02rem] leading-[1.7]">
                  <p>We make the valuable thinking visible enough to work with.</p>
                  <p>Not another dumping ground. Not a gigantic folder called &ldquo;knowledge base&rdquo; that nobody opens.</p>
                  <p>We create enough structure for the intelligence to become usable.</p>
                </div>
              </div>
              <div className="bg-[color:var(--ivory)] pl-0 pt-6 pb-8 sm:pl-10">
                <p className="lbl text-[color:var(--ox)]">Then we put it to work</p>
                <div className="mt-4 space-y-4 text-[1.02rem] leading-[1.7]">
                  <p>This is the important part. Because beautifully organised information that still sits there doing nothing is just a tidier form of waste.</p>
                  <p>The intelligence goes somewhere. Into the client experience. Into the way your team makes decisions. Into your content and intellectual property. Into the systems running the business. Into AI that finally has something meaningful to work with. Into an idea you didn&rsquo;t know was hiding there. Into whatever can create the most value now.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 07 · Founder Intelligence ─────────────────────────────── */}
        <Rule />
        <ChapterHead n="07">A name for it</ChapterHead>
        <section className="px-6 pt-12 pb-20">
          <div className="mx-auto max-w-[1360px]">
            <p className="text-[1.15rem]">There&rsquo;s a name for what we&rsquo;re uncovering.</p>
            <h2 className="nr mt-4 text-[3rem] leading-[1.02] text-[color:var(--ox)] md:text-[5rem]">Founder Intelligence.</h2>
            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr]">
              <div className="space-y-5 text-[1.08rem] leading-[1.75]">
                <p>It&rsquo;s the accumulated thinking behind the business.</p>
                <p>Not simply what you know.</p>
                <p className="nr text-[1.7rem]"><em>How</em> you know what to do.</p>
                <ul className="space-y-1.5 pl-5" style={{ listStyleType: 'disc' }}>
                  <li>How you recognise quality.</li>
                  <li>How you interpret context.</li>
                  <li>How you adapt your methodology.</li>
                  <li>How you make trade-offs.</li>
                  <li>How you know when the normal rule does not apply.</li>
                  <li>How you see things other people miss.</li>
                  <li>How you make the work yours.</li>
                </ul>
              </div>
              <div className="space-y-5 text-[1.08rem] leading-[1.75]">
                <p>Most businesses document the visible layer.</p>
                <p>The task. The process. The checklist. Useful.</p>
                <p>But the most valuable businesses have another layer underneath:</p>
                <p className="nr text-[1.6rem] leading-[1.4]">the intelligence responsible for making the process <em>work well.</em></p>
                <p className="nr text-[1.6rem] leading-[1.4] text-[color:var(--ox)]">That is the layer we are after.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 08 ────────────────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="08">Information is not intelligence</ChapterHead>
        <section className="px-6 pt-12 pb-20">
          <div className="mx-auto max-w-[1360px]">
            <h2 className="nr max-w-[17em] text-[2.4rem] leading-[1.08] md:text-[3.2rem]">
              Because having the information is not the same as being able to <em>use the intelligence.</em>
            </h2>
            <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
              <ul className="space-y-4 text-[1.08rem] leading-[1.7]">
                {[
                  'You can have the SOP and still need the founder.',
                  'You can have the course and still need the founder.',
                  'You can have the brand guide and still produce work that feels completely wrong.',
                  'You can have every podcast episode archived and still have no idea what you said about a particular subject three years ago.',
                  'You can upload twenty files to AI and still receive an answer that makes you think:',
                ].map((t) => (
                  <li key={t} className="border-b border-[color:var(--ink)]/15 pb-4">{t}</li>
                ))}
                <li className="nr pt-1 text-[1.6rem]"><em>Technically fine. Absolutely not.</em></li>
              </ul>
              <div className="space-y-5 text-[1.08rem] leading-[1.75] lg:pt-2">
                <p>The problem isn&rsquo;t always missing information.</p>
                <p>Sometimes the business is drowning in information.</p>
                <p className="nr text-[1.7rem]">The missing layer is <em className="text-[color:var(--ox)]">context.</em></p>
                <p>Connection. Judgement. Meaning.</p>
                <p>That is why generic prompts so often produce generic work.</p>
                <p>AI cannot magically understand a business that has never made its own intelligence available.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 09 · Leverage ─────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="09">Where AI gets exciting</ChapterHead>
        <section className="px-6 pt-12 pb-20">
          <div className="mx-auto max-w-[1360px]">
            <h2 className="nr max-w-[15em] text-[2.4rem] leading-[1.08] md:text-[3.2rem]">
              And this is where AI gets <em>genuinely exciting.</em>
            </h2>
            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr]">
              <div className="space-y-5 text-[1.08rem] leading-[1.75]">
                <p>Not as a content machine.</p>
                <p>Not as a shortcut to producing more mediocre things faster.</p>
                <p className="nr text-[2rem] text-[color:var(--ox)]">As <em>leverage.</em></p>
                <p>
                  A way to interact with years of knowledge that used to be practically
                  impossible to work across. A way to make expertise available at the
                  moment someone actually needs it. A way for a small founder-led company
                  to build capabilities that once required researchers, writers, analysts,
                  technologists and entire teams.
                </p>
                <p>That matters.</p>
                <p>
                  Especially to those of us who have spent years building without
                  unlimited capital, enormous departments or rooms full of people whose
                  sole job was to extend our capacity.
                </p>
              </div>
              <div className="space-y-5 text-[1.08rem] leading-[1.75]">
                <p className="nr text-[1.6rem] leading-[1.4]">AI has changed the economics of leverage.</p>
                <p className="nr text-[1.6rem] leading-[1.4]">And I want more <em>women</em> using that leverage.</p>
                <p>Not because every woman needs to become obsessed with artificial intelligence.</p>
                <p>Not because technology deserves another fan club.</p>
                <p>
                  Because when we understand these tools well enough to use them
                  consciously, we get to decide what we do with the leverage.
                </p>
                <ul className="space-y-1.5 pl-5" style={{ listStyleType: 'disc' }}>
                  <li>What we build.</li><li>Who we help.</li><li>Whose ideas travel.</li>
                  <li>Whose methodologies become more accessible.</li>
                  <li>Whose businesses become more capable.</li>
                  <li>Whose intelligence gets represented in the systems people increasingly use to work, learn and make decisions.</li>
                </ul>
                <p className="nr text-[1.6rem]">That matters to me. <em>A lot.</em></p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 10 ────────────────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="10">What becomes possible</ChapterHead>
        <section className="px-6 pt-12 pb-20">
          <div className="mx-auto max-w-[1360px]">
            <h2 className="nr max-w-[16em] text-[2.4rem] leading-[1.08] md:text-[3.2rem]">
              You do not need to become an AI expert. But I do want you to know <em>what becomes possible.</em>
            </h2>
            <div className="mt-12 max-w-[36em] space-y-5 text-[1.08rem] leading-[1.75]">
              <p>Because there is a huge difference between:</p>
              <p className="nr text-[1.5rem]">&ldquo;Look what AI can make.&rdquo;</p>
              <p>and:</p>
              <p className="nr text-[1.7rem] text-[color:var(--ox)]">&ldquo;Look what AI can make possible <em>with what I already know.</em>&rdquo;</p>
              <p>That second question is where Envisioned lives.</p>
            </div>
          </div>
        </section>

        {/* ── 11 · When it becomes usable ───────────────────────────── */}
        <Rule />
        <ChapterHead n="11">When it becomes usable</ChapterHead>
        <section className="px-6 pt-12 pb-20">
          <div className="mx-auto max-w-[1360px]">
            <h2 className="nr max-w-[15em] text-[2.4rem] leading-[1.08] md:text-[3.4rem]">
              When your intelligence becomes usable, <em>the business changes.</em>
            </h2>
            <div className="mt-14 grid gap-x-14 gap-y-12 lg:grid-cols-2">
              <div>
                <p className="num text-[2.2rem] text-[color:var(--ox)]">01</p>
                <p className="nr mt-2 text-[1.5rem]">Your clients get more of what they actually hired you for.</p>
                <p className="mt-4 text-[1.02rem] leading-[1.7]">
                  Not simply access to more information. More of the judgement behind the
                  information. More help applying what you teach when the real-world
                  situation refuses to fit neatly inside the example from Module Four.
                </p>
              </div>
              <div>
                <p className="num text-[2.2rem] text-[color:var(--ox)]">02</p>
                <p className="nr mt-2 text-[1.5rem]">Your team stops having to reverse-engineer you.</p>
                <p className="mt-4 text-[1.02rem] leading-[1.7]">
                  They can access more of the context behind your decisions instead of
                  following the process until something unusual happens and then sending
                  the whole problem back upstairs.
                </p>
              </div>
              <div>
                <p className="num text-[2.2rem] text-[color:var(--ox)]">03</p>
                <p className="nr mt-2 text-[1.5rem]">Your body of work starts working again.</p>
                <p className="mt-4 text-[1.02rem] leading-[1.7]">
                  Old workshops stop being old workshops. Content stops disappearing the
                  day after you publish it. Past client conversations become usable
                  intelligence. Ideas start connecting across years instead of living in
                  separate digital boxes.
                </p>
              </div>
              <div>
                <p className="num text-[2.2rem] text-[color:var(--ox)]">04</p>
                <p className="nr mt-2 text-[1.5rem]">AI stops starting from zero.</p>
                <p className="mt-4 text-[1.02rem] leading-[1.7]">
                  It has something far more useful than another clever prompt. It has
                  context. Your language. Your thinking. Your standards. Your examples.
                  Your methodology. Something distinctly yours to reason with.
                </p>
              </div>
            </div>
            <div className="mt-16 max-w-[36em] space-y-5 text-[1.08rem] leading-[1.75]">
              <p className="nr text-[1.6rem]">And you get to see the business <em>differently.</em></p>
              <p>This is one of my favourite parts.</p>
              <p>Because sometimes we go looking for one thing&hellip; and find something else entirely.</p>
              <p>
                An opportunity. An offer. A connection. A method hiding inside what looked
                like a collection of unrelated decisions. A piece of intellectual property
                that has been there for years without anybody recognising what it could become.
              </p>
              <p>We don&rsquo;t always know what we&rsquo;re going to find.</p>
              <p className="nr text-[1.5rem] text-[color:var(--ox)]"><em>That&rsquo;s rather the point.</em></p>
            </div>
          </div>
        </section>

        <Ticker items={['Codified in the City', 'Your intelligence. Made usable.']} dark />

        {/* ── CITC band ─────────────────────────────────────────────── */}
        <section id="citc" className="relative overflow-hidden">
          <div className="relative h-[560px] w-full">
            <Image src="/img/atmosphere-terrace.jpg" alt="Terrace table in Mediterranean light" fill className="object-cover" />
            <div className="absolute inset-0 bg-[#2C2522]/55" />
            <div className="absolute inset-0 flex items-center px-6">
              <div className="mx-auto w-full max-w-[1360px]">
                <p className="lbl text-[#E8C4A8]">The hero experience</p>
                <h2 className="nr mt-4 max-w-[12em] text-[2.6rem] leading-[1.05] text-[#F6F0E7] md:text-[3.8rem]">
                  Codified in the City
                </h2>
                <p className="nr mt-6 max-w-[24em] text-[1.3rem] leading-[1.5] text-[#F6F0E7] md:text-[1.6rem]">
                  One private day to discover what your business already knows — and put
                  the most valuable part of it to work.
                </p>
                <p className="mt-4 max-w-[30em] text-[1.05rem] text-[#F6F0E7]/85">
                  One private day. Your real intelligence. A working system. <em className="nr">The lunch is part of the point.</em>
                </p>
                <a href={CITC_MAILTO} className="lbl mt-8 inline-block bg-[color:var(--ox)] px-6 py-3 text-[#F6F0E7] transition-opacity hover:opacity-90">
                  Explore Codified in the City ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Ways to work ──────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="12">Ways to work together</ChapterHead>
        <section id="ways-to-work" className="px-6 pt-12 pb-20">
          <div className="mx-auto max-w-[1360px]">
            <h2 className="nr max-w-[16em] text-[2.4rem] leading-[1.08] md:text-[3.2rem]">
              Begin with the part that needs to become <em>usable first.</em>
            </h2>
            <div className="mt-12 grid sm:grid-cols-3">
              <div className="flex flex-col border-t-2 border-[color:var(--ink)] pt-6 pr-8 pb-8">
                <p className="lbl text-[color:var(--ox)]">One</p>
                <p className="nr mt-4 text-[1.6rem] leading-[1.25]">Not ready for the full build? Start with The Integration Map.</p>
                <p className="mt-4 flex-1 text-[1.02rem] leading-[1.7]">
                  Sometimes you know there is value everywhere. You just cannot tell which
                  part deserves your attention first.
                </p>
                <a href={MAP_MAILTO} className="lbl mt-6 text-[color:var(--ink)] transition-colors hover:text-[color:var(--ox)]">
                  Start with the Map →
                </a>
              </div>
              <div className="flex flex-col border-t-2 border-[color:var(--ink)] pt-6 pb-8 sm:px-8">
                <p className="lbl text-[color:var(--ox)]">Two</p>
                <p className="nr mt-4 text-[1.6rem] leading-[1.25]">Already building? Stay for The Residency.</p>
                <p className="mt-4 flex-1 text-[1.02rem] leading-[1.7]">
                  The interesting thing about making one part of the business more
                  intelligent is that you start noticing all the other places where the
                  same thinking could travel.
                </p>
                <a href={RES_MAILTO} className="lbl mt-6 text-[color:var(--ink)] transition-colors hover:text-[color:var(--ox)]">
                  Ask about The Residency →
                </a>
              </div>
              <div className="flex flex-col border-t-2 border-[color:var(--ink)] pt-6 pb-8 sm:pl-8">
                <p className="lbl text-[color:var(--ox)]">Three</p>
                <p className="nr mt-4 text-[1.6rem] leading-[1.25]">For the businesses ready to go deeper: Embedded Genius</p>
                <p className="mt-4 flex-1 text-[1.02rem] leading-[1.7]">
                  For selected founder-led businesses ready to make their intelligence
                  usable across a larger part of the company.
                </p>
                <a href={EG_MAILTO} className="lbl mt-6 text-[color:var(--ink)] transition-colors hover:text-[color:var(--ox)]">
                  Enquire about Embedded Genius →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Probably for you ──────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="13">Probably for you if</ChapterHead>
        <section className="px-6 pt-12 pb-20">
          <div className="mx-auto max-w-[1360px]">
            <h2 className="nr text-[2.4rem] leading-[1.08] md:text-[3.2rem]">
              This is probably for you if&hellip;
            </h2>
            <ul className="mt-12 max-w-[46em] space-y-4 text-[1.08rem] leading-[1.7]">
              {[
                'You’ve been in business long enough to know you have more valuable material than you know what to do with.',
                'You have a proven methodology, distinctive expertise or body of work that people already pay for.',
                'You’ve started experimenting with AI and can see the potential — but you’re underwhelmed by generic outputs and increasingly allergic to generic advice.',
                'You’re less interested in “100 prompts to save five hours a week” and more interested in what becomes possible when technology actually understands your business.',
                'You care about protecting what makes your work yours.',
                'You want your team and clients to benefit from more of what you know.',
                'And you have a sneaking suspicion that some of the best things you’ll build next may already be hiding inside what you built before.',
              ].map((t) => (
                <li key={t} className="border-b border-[color:var(--ink)]/15 pb-4">{t}</li>
              ))}
            </ul>
            <p className="nr mt-10 text-[1.7rem]">Good.</p>
            <p className="nr text-[1.7rem] text-[color:var(--ox)]"><em>That is exactly where I like to start.</em></p>
          </div>
        </section>

        {/* ── About ─────────────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="14">About</ChapterHead>
        <section id="about" className="px-6 pt-12 pb-20">
          <div className="mx-auto grid max-w-[1360px] gap-14 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <Image src="/img/portrait-mi.jpg" alt="Maria-Ines, portrait in warm light with natural curls" width={720} height={900} className="w-full object-cover" />
              <p className="lbl mt-4 text-[color:var(--ink)]/70">Pattern spotter. Strategist. Builder.</p>
            </div>
            <div className="space-y-5 text-[1.08rem] leading-[1.75]">
              <h2 className="nr text-[2.6rem] leading-[1.1] md:text-[3.2rem]">I&rsquo;m Maria-Ines.</h2>
              <p>And I am fairly obsessed with the intelligence people don&rsquo;t realise they have.</p>
              <p>
                My career has moved through international development, photography, brand
                strategy, founder-led businesses and AI. Different industries. Same fascination.
              </p>
              <p className="nr text-[1.5rem] leading-[1.4]">
                What do people know that the systems around them <em>fail to capture?</em>
              </p>
              <p>What gets lost? What gets overlooked? What becomes possible when you finally make it visible?</p>
              <p>
                I&rsquo;m a visual thinker. A pattern spotter. A strategist. A builder. And
                the person who will absolutely stop you halfway through a sentence because
                the thing you just said casually is probably more important than the
                polished answer you prepared.
              </p>
              <p>I care about technology.</p>
              <p>But I care much more about what humans decide to do with it.</p>
              <p>
                And I care deeply about more women having access to the kind of leverage
                that once belonged almost exclusively to organisations with more money,
                more people and more infrastructure.
              </p>
              <p>Because when more of us can make our intelligence travel&hellip;</p>
              <ul className="space-y-1.5 pl-5" style={{ listStyleType: 'disc' }}>
                <li>We build differently.</li><li>We help differently.</li>
                <li>We participate differently.</li>
                <li>We create opportunities that weren&rsquo;t available before.</li>
                <li>And we get to imagine forms of impact that previously required resources many of us simply did not have.</li>
              </ul>
              <p className="nr text-[1.5rem] text-[color:var(--ox)]">That is the future I&rsquo;m interested in.</p>
            </div>
          </div>
        </section>

        {/* ── Closing ───────────────────────────────────────────────── */}
        <Rule />
        <section className="px-6 pt-16 pb-8">
          <div className="mx-auto max-w-[1360px]">
            <div className="max-w-[38em] space-y-5 text-[1.08rem] leading-[1.75]">
              <p className="nr text-[1.7rem] leading-[1.35]">
                So no, I don&rsquo;t think you need to create more just because AI makes it easy.
              </p>
              <p className="nr text-[1.7rem] leading-[1.35]">
                I think we should start with what you&rsquo;ve <em>already earned.</em>
              </p>
              <p>The years. The experience. The mistakes. The ideas. The judgement. The work. The human intelligence.</p>
            </div>
          </div>
        </section>

        <Ticker items={['Find it.', 'Honour it.', 'Make it usable.', 'Then add the leverage.']} />

        <section className="bg-[color:var(--char)] px-6 py-24 text-[#F6F0E7]">
          <div className="mx-auto max-w-[1360px]">
            <p className="nr text-[1.4rem] text-[#F6F0E7]/80">And after that?</p>
            <h2 className="nr mt-3 max-w-[14em] text-[2.6rem] leading-[1.08] md:text-[3.8rem]">
              Let&rsquo;s see what becomes <em>possible.</em>
            </h2>
            <p className="mt-8 max-w-[30em] text-[1.1rem] leading-[1.7] text-[#F6F0E7]/85">
              Your business is already sitting on extraordinary value. We find it,
              organise it and put it to work.
            </p>
            <a href={CITC_MAILTO} className="lbl mt-10 inline-block bg-[color:var(--ox)] px-7 py-3.5 text-[#F6F0E7] transition-opacity hover:opacity-90">
              Explore Codified in the City ↗
            </a>
            <div className="mt-20 flex flex-col gap-3 border-t border-[#F6F0E7]/20 pt-8 md:flex-row md:items-baseline md:justify-between">
              <div>
                <p className="nr text-[1.3rem]">Envisioned Brands</p>
                <p className="lbl mt-1 text-[#F6F0E7]/60">Your intelligence. Made usable.</p>
              </div>
              <div className="lbl flex flex-wrap gap-x-8 gap-y-2 text-[#F6F0E7]/70">
                <a href="#citc" className="hover:text-[#F6F0E7]">Codified in the City</a>
                <a href="#ways-to-work" className="hover:text-[#F6F0E7]">Ways to Work</a>
                <a href="mailto:hello@mariaines.co" className="hover:text-[#F6F0E7]">hello@mariaines.co</a>
              </div>
            </div>
            <p className="lbl mt-8 text-[#F6F0E7]/40">© 2026 Envisioned Brands · Written, built and run from Europe.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
