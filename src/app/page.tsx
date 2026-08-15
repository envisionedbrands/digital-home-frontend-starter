import Image from 'next/image';
import HomeFx from '@/components/home-fx';

/**
 * Homepage — the Chronicle front page (chronicle.northfolk.co, a Showit
 * newspaper template), rebuilt in the brand-wide Meganté system per MI
 * 2026-08-14 (DECISIONS #014). Chronicle contributes the newspaper
 * ARCHITECTURE: numbered masthead, dateline, stacked display hero, pull-out
 * card row, ticker bands as department dividers, numbered ledgers, heavy
 * rules, numbered chapters, act-break photography, numbered footer links.
 * All copy is Maria-Ines's, verbatim.
 *
 * List doctrine (MI 2026-08-14 "act like an award-winning UI/UX designer"):
 * NO stacked disc bullets. Short fragments → inventory sheets (numbered
 * grid cells with hairlines). Long items → numbered ledgers (Courier index
 * + hairline rows). Paired prose columns get a vertical column rule.
 *
 * Meganté has no italic — <em> renders upright in olive (sage in .dk dark
 * bands, ivory over photos). The global NavBar/Footer return null on "/".
 */

const MAP_MAILTO = 'mailto:hello@mariaines.co?subject=The%20Integration%20Map';
const CITC_MAILTO = 'mailto:hello@mariaines.co?subject=Codified%20in%20the%20City';
const RES_MAILTO = 'mailto:hello@mariaines.co?subject=The%20Residency';
const EG_MAILTO = 'mailto:hello@mariaines.co?subject=Embedded%20Genius';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Courier+Prime:wght@400;700&display=swap');
.ch { --ivory:#FBFAF9; --ink:#1E1E1E; --stone:#EDE9E3; --ox:#4C5A2E; --char:#1E1E1E; --rose:#B87A5D; --sage:#8A9A6B; --hair:rgba(30,30,30,0.12);
  font-family:'Inter',system-ui,sans-serif; background:var(--ivory); color:var(--ink); }
.ch .nr { font-family:'Megante',Georgia,serif; font-weight:400; letter-spacing:0.005em; }
.ch .nr em, .ch em.nr { font-style:normal; font-weight:400; color:var(--ox); }
.ch .dk em, .ch .dk .nr em, .ch .dk em.nr { color:var(--sage); }
.ch .rose-beat em { color:var(--rose); }
.ch .photo-em em { color:#FBFAF9; opacity:0.85; }
.ch .lbl { font-family:'Courier Prime',monospace; font-weight:400; text-transform:uppercase; letter-spacing:0.3em; font-size:0.72rem; }
.ch .idx { font-family:'Courier Prime',monospace; font-weight:400; font-size:0.72rem; letter-spacing:0.12em; color:var(--ox); }
.ch .num { font-family:'Megante',Georgia,serif; font-weight:400; }
@keyframes ch-ticker { from { transform:translateX(0); } to { transform:translateX(-50%); } }
.ch .ticker-track { display:flex; width:max-content; animation:ch-ticker 36s linear infinite; }
.ch .heavy { border-top:2px solid var(--ink); position:relative; }
.ch .heavy::after { content:''; position:absolute; left:0; right:0; top:4px; border-top:1px solid rgba(30,30,30,0.35); }

/* ── Motion layer (choreography only, no new visual design) ─────────── */
.ch.fx [data-rv] { opacity:0; transform:translateY(26px); transition:opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1); transition-delay:calc(var(--i,0)*90ms); }
.ch.fx [data-rv].rv-in { opacity:1; transform:none; }
.ch.fx [data-draw] { transform:scaleX(0); transform-origin:left; transition:transform 1.2s cubic-bezier(.22,1,.36,1); }
.ch.fx [data-draw].rv-in { transform:scaleX(1); }
@keyframes ch-rise { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:none; } }
@keyframes ch-settle { from { transform:scale(1.08); } to { transform:scale(1); } }
.ch .hero-zoom { animation:ch-settle 2.8s cubic-bezier(.22,1,.36,1) both; }
.ch .h-a { animation:ch-rise .9s .2s cubic-bezier(.22,1,.36,1) both; }
.ch .h-b { animation:ch-rise .9s .45s cubic-bezier(.22,1,.36,1) both; }
.ch .h-c { animation:ch-rise .9s .7s cubic-bezier(.22,1,.36,1) both; }
.ch .h-d { animation:ch-rise .9s .95s cubic-bezier(.22,1,.36,1) both; }
.ch .tickerwrap:hover .ticker-track { animation-play-state:paused; }
.ch [data-px] img { transition:none; will-change:transform; }
.ch .ledger li { transition:background-color .35s, transform .35s cubic-bezier(.22,1,.36,1); }
.ch .ledger li:hover { background-color:var(--stone); transform:translateX(6px); }
.ch .sheet > div { transition:background-color .35s; }
.ch .sheet > div:hover { background-color:var(--stone); }
.ch .pull-cards a { transition:background-color .35s; }
.ch .pull-cards a:hover { background-color:var(--stone); }
.ch .masthead { transition:transform .5s cubic-bezier(.22,1,.36,1), opacity .5s cubic-bezier(.22,1,.36,1); }
.ch .hero-logo { transition:opacity .45s cubic-bezier(.22,1,.36,1), transform .45s cubic-bezier(.22,1,.36,1); }
.ch.nav-on .hero-logo { animation:none; opacity:0; transform:translateY(-16px); }
.ch.fx .masthead:not(.nav-in) { transform:translateY(-100%); opacity:0; }
.ch .typeband { font-family:'Courier Prime',monospace; letter-spacing:0.06em; }
.ch .hero-tw .caret { background:#FBFAF9; opacity:0.9; }
.ch .h-e { animation:ch-rise .9s 1.15s cubic-bezier(.22,1,.36,1) both; }
.ch .typeband .caret { display:inline-block; width:0.55em; height:1.15em; margin-left:0.12em; vertical-align:text-bottom; background:var(--ox); animation:ch-caret 1.05s step-end infinite; }
@keyframes ch-caret { 0%,100% { opacity:1; } 50% { opacity:0; } }
.ch .quote-tw em { font-family:'Courier Prime',monospace; font-style:italic; font-size:0.88em; letter-spacing:0; color:var(--ox); }
@media (prefers-reduced-motion: reduce) {
  .ch .hero-zoom, .ch .h-a, .ch .h-b, .ch .h-c, .ch .h-d, .ch .h-e { animation:none; }
  .ch .ticker-track { animation:none; }
  .ch .typeband .caret { animation:none; }
}
`;

const WRAP = 'mx-auto max-w-[1280px]';

function Rule() {
  return <div className={`heavy ${WRAP} mx-6 lg:mx-auto`} />;
}

function ChapterHead({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className={`${WRAP} flex items-baseline justify-between px-6 pt-6`}>
      <span className="lbl text-[color:var(--ox)]">{children}</span>
      <span className="num text-[2rem] leading-none text-[color:var(--ink)]/60">{n}</span>
    </div>
  );
}

/** Art-directed chapter opener — ghost numeral as a design object. */
function GhostHead({ n, kicker, title }: { n: string; kicker: string; title: React.ReactNode }) {
  return (
    <div className={`${WRAP} relative px-6 pt-20`}>
      <span aria-hidden="true" className="num pointer-events-none absolute -top-10 right-0 select-none text-[8rem] leading-none text-[color:var(--stone)] md:text-[15rem]">{n}</span>
      <p className="lbl relative text-[color:var(--ox)]">{kicker}</p>
      <h2 className="nr relative mt-10 max-w-[12em] text-[2.6rem] leading-[1.05] md:text-[4.2rem]">{title}</h2>
    </div>
  );
}

function Ticker({ items, dark = false }: { items: string[]; dark?: boolean }) {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="nr flex items-center whitespace-nowrap px-2 text-[1.55rem] md:text-[1.9rem]">
          {t}
          <span aria-hidden="true" className={`mx-6 inline-block h-1.5 w-1.5 rounded-full ${dark ? 'bg-[#FBFAF9]/60' : 'bg-[color:var(--ox)]'}`} />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`tickerwrap overflow-hidden border-y py-5 ${dark ? 'border-transparent bg-[color:var(--char)] text-[#FBFAF9]' : 'border-[color:var(--ink)] text-[color:var(--ink)]'}`}>
      <div className="ticker-track">{row('a')}{row('b')}</div>
    </div>
  );
}

/** Numbered ledger — list items become indexed rows with hairlines. */
function Ledger({ items, tight = false }: { items: React.ReactNode[]; tight?: boolean }) {
  return (
    <ol className="ledger stagger border-t border-[color:var(--hair)]">
      {items.map((t, i) => (
        <li key={i} className={`flex gap-6 border-b border-[color:var(--hair)] ${tight ? 'py-3.5' : 'py-5'}`}>
          <span className="idx shrink-0 pt-1">{String(i + 1).padStart(2, '0')}</span>
          <span className="text-[1.05rem] leading-[1.65]">{t}</span>
        </li>
      ))}
    </ol>
  );
}

/** Inventory sheet — short fragments become a numbered grid of cells. */
function Sheet({ items, cols = 3 }: { items: string[]; cols?: 2 | 3 | 4 }) {
  const colCls = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[cols];
  return (
    <div className={`sheet stagger grid grid-cols-1 gap-x-10 ${colCls}`}>
      {items.map((t, i) => (
        <div key={t} className="flex items-baseline gap-4 border-t border-[color:var(--hair)] py-4">
          <span className="idx shrink-0">{String(i + 1).padStart(2, '0')}</span>
          <span className="text-[1rem] leading-[1.55]">{t}</span>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="ch">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <HomeFx />

      {/* ── Masthead — ink band, numbered nav ───────────────────────── */}
      <header className="masthead fixed inset-x-0 top-0 z-50 bg-[color:var(--char)] text-[#FBFAF9]">
        <div className="relative mx-auto flex h-[64px] max-w-[1360px] items-center justify-between px-6">
          <nav className="hidden items-center gap-8 lg:flex">
            {[
              ['01', 'Founder Intelligence', '#founder-intelligence'],
              ['02', 'Codified in the City', '#citc'],
            ].map(([n, label, href]) => (
              <a key={label} href={href} className="lbl flex items-baseline gap-2 text-[#FBFAF9]/85 transition-colors hover:text-[#FBFAF9]">
                <span className="text-[0.6rem] text-[#FBFAF9]/50">{n}</span>
                {label}
              </a>
            ))}
          </nav>
          <a href="#top" aria-label="Envisioned by Maria-Ines — back to top" className="absolute left-1/2 -translate-x-1/2">
            <Image src="/img/logo-envisioned-white.png" alt="" width={150} height={54} className="h-[36px] w-auto" />
          </a>
          <div className="flex items-center gap-5">
            <nav className="hidden items-center gap-6 lg:flex">
              {[
                ['03', 'Ways to Work', '#ways-to-work'],
                ['04', 'About', '#about'],
              ].map(([n, label, href]) => (
                <a key={label} href={href} className="lbl flex items-baseline gap-2 text-[#FBFAF9]/85 transition-colors hover:text-[#FBFAF9]">
                  <span className="text-[0.6rem] text-[#FBFAF9]/50">{n}</span>
                  {label}
                </a>
              ))}
            </nav>
            <a href={MAP_MAILTO} className="lbl bg-[color:var(--ox)] px-4 py-2.5 text-[#FBFAF9] transition-opacity hover:opacity-90">
              Start with the Map
            </a>
            <a href="https://app.envisioned.me/login" title="Studio login" className="lbl text-[#FBFAF9]/50 transition-colors hover:text-[#FBFAF9]">
              Studio
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        {/* ── Cover — the Martini move: lockup + headline stay pinned
             while the photography scrolls beneath them ─────────────── */}
        <section id="founder-intelligence" className="relative">
          <div className="pointer-events-none sticky top-0 z-10 flex h-screen flex-col items-center px-6 pt-10 pb-12">
            {/* Traveling scrim — legibility never depends on the photo behind */}
            <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 62% 52% at 50% 46%, rgba(30,30,30,0.42) 0%, rgba(30,30,30,0.18) 62%, rgba(30,30,30,0) 100%)' }} />
            <Image src="/img/logo-envisioned-white.png" alt="Envisioned by Maria-Ines" width={300} height={108} priority className="hero-logo h-a relative w-[190px] md:w-[250px]" />
            <div className="photo-em relative flex w-full max-w-[880px] flex-1 flex-col items-center justify-center text-center">
              <h1 className="h-b nr max-w-[13em] text-[2.5rem] leading-[1.06] text-[#FBFAF9] md:text-[3.8rem]">
                Your business is already sitting on <em>extraordinary value.</em>
              </h1>
              <p
                className="typeband hero-tw h-c mt-10 min-h-[1.6em] text-[1.3rem] text-[#FBFAF9]/95 md:text-[1.85rem]"
                data-typewriter='["Years of ideas.","Client conversations.","Methodologies.","Decisions.","Workshops.","Content.","Frameworks.","Patterns you notice without even realising you notice them anymore."]'
              >
                Years of ideas.
              </p>
              <p className="h-e mt-10 max-w-[34em] text-[1.1rem] leading-[1.7] text-[#FBFAF9]/90 md:text-[1.2rem]">
                We find it, organise it, and put it to work — so you, your team, your
                clients and AI can use more of what you&rsquo;ve spent years creating.
              </p>
              <a href={CITC_MAILTO} className="pointer-events-auto h-d lbl mt-12 flex items-center gap-2 text-[#FBFAF9]/85 transition-colors hover:text-[#FBFAF9]">
                Explore Codified in the City <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div className="relative z-0 -mt-[100vh]">
            <div className="relative h-screen overflow-hidden">
              <Image src="/img/hero-postcard.jpg" alt="Tuscan window with shutters, espresso and notebook in golden morning light" fill priority className="hero-zoom object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(30,30,30,0.52) 0%, rgba(30,30,30,0.30) 45%, rgba(30,30,30,0.58) 100%)' }} />
            </div>
            <div className="relative h-[85vh] overflow-hidden">
              <Image src="/img/movement-drive.jpg" alt="Driving through the Tuscan countryside" fill className="object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(30,30,30,0.55) 0%, rgba(30,30,30,0.35) 50%, rgba(30,30,30,0.62) 100%)' }} />
            </div>
          </div>
        </section>

        <section className="px-6 py-32">
          <div className={`${WRAP} grid gap-14 lg:grid-cols-12 lg:items-end`}>
            <div className="lg:col-span-7">
              <p className="text-[1.05rem] leading-[1.8]">You&rsquo;ve already done the hard part.</p>
              <p className="text-[1.05rem] leading-[1.8]">You built the intelligence.</p>
              <p className="mt-6 text-[1.05rem] leading-[1.8]">The problem?</p>
              <p className="fx-rv nr mt-10 max-w-[10em] text-[2.8rem] leading-[1.06] md:text-[4rem]">
                Most of it is sitting there doing <em>remarkably little.</em>
              </p>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <Image src="/img/hero-desk.jpg" alt="Desk with notebook and coffee in warm light" width={640} height={460} className="w-full object-cover" />
            </div>
          </div>
        </section>

        <div className="dk bg-[color:var(--char)] py-6 text-center">
          <p className="nr text-[1.4rem] text-[#FBFAF9] md:text-[1.7rem]">Founder intelligence, <em>made usable.</em></p>
          <p className="lbl mt-2 text-[#FBFAF9]/50">E / B</p>
        </div>

        {/* ── 02 ────────────────────────────────────────────────────── */}
        <Rule />
        <GhostHead n="02" kicker="Before you create more" title={<>Before you create more with AI, find out what you <em>already own.</em></>} />
        <section className="px-6 pt-16 pb-28">
          <div className={WRAP}>
            <p className="text-[1.05rem]">AI has made it absurdly easy to create.</p>
            <div className="mt-6">
              <Sheet cols={3} items={[
                'More content.', 'More offers.', 'More emails.',
                'More PDFs.', 'More assistants.', 'More agents.',
                'More things to add to the enormous pile of things your business already has.',
              ]} />
            </div>

            <div className="mt-24 grid gap-12 lg:grid-cols-12">
              <div className="space-y-5 text-[1.05rem] leading-[1.8] lg:col-span-5">
                <p>But more is not automatically better.</p>
                <p>
                  Especially when some of your most original thinking is sitting inside a
                  masterclass you taught four years ago. Or buried in a client call nobody
                  has listened to since. Or scattered across 200 pieces of content. Or
                  hiding inside the way you instinctively make decisions. Or locked inside
                  a methodology your clients understand — but still need you to help them apply.
                </p>
              </div>
              <div className="space-y-5 text-[1.05rem] leading-[1.8] lg:col-span-4 lg:col-start-8 lg:pt-28">
                <p>We&rsquo;re in an era of almost infinite generation.</p>
                <p>And somehow the first instruction has been: generate more.</p>
                <p>The valuable material is rarely missing. It is usually scattered.</p>
                <p>I&rsquo;m much more interested in another question:</p>
              </div>
            </div>

            {/* The chapter's one pull moment — pinned while photography
                 passes over it (the Aperol move). Courier-italic accent trial. */}
            <div className="relative -mx-6 lg:mx-0">
              <div className="sticky top-0 z-0 flex h-screen items-center justify-center px-6">
                <p className="quote-tw nr mx-auto max-w-[1080px] text-center text-[2.4rem] leading-[1.14] md:text-[3.6rem]">
                  What have you already created that your business <em>doesn&rsquo;t know how to use?</em>
                </p>
              </div>
              <div className="pointer-events-none relative z-10 -mt-[100vh]">
                <div className="flex h-[75vh] items-center pl-[6%]">
                  <Image src="/img/hero-desk.jpg" alt="Desk with notebook and coffee in warm light" width={420} height={300} className="w-[240px] border border-[color:var(--ink)]/15 object-cover md:w-[380px]" />
                </div>
                <div className="flex h-[80vh] items-center justify-end pr-[8%]">
                  <Image src="/img/city-cafe.jpg" alt="Espresso at a café table in the city" width={460} height={330} className="w-[260px] border border-[color:var(--ink)]/15 object-cover md:w-[420px]" />
                </div>
                <div className="flex h-[70vh] items-center justify-center">
                  <Image src="/img/lived-intelligence.jpg" alt="Working across a table, marking up documents" width={420} height={300} className="w-[230px] border border-[color:var(--ink)]/15 object-cover md:w-[360px]" />
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-[36em] space-y-5 text-[1.05rem] leading-[1.8]">
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
        </section>

        {/* Act break */}
        <div data-px className="relative h-[420px] w-full overflow-hidden">
          <Image src="/img/lived-intelligence.jpg" alt="Working across a table, marking up documents" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#1E1E1E]/45" />
          <p className="photo-em nr absolute inset-x-6 bottom-10 mx-auto max-w-[1280px] text-[1.5rem] text-[#FBFAF9] md:text-[2rem]">
            Judgement. Context. Patterns. <em>The invisible architecture of the work.</em>
          </p>
        </div>

        {/* ── 03 ────────────────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="03">What is distinctly yours</ChapterHead>
        <section className="px-6 pt-12 pb-20">
          <div className={WRAP}>
            <h2 className="nr max-w-[15em] text-[2.2rem] leading-[1.08] md:text-[3.1rem]">
              We don&rsquo;t start with the machine. We start with what is <em>distinctly yours.</em>
            </h2>

            <p className="mt-12 text-[1.05rem]">Your business has accumulated far more than documents.</p>
            <div className="mt-6">
              <Sheet cols={3} items={[
                'It has accumulated judgement.', 'Context.', 'Patterns.',
                'Language.', 'Standards.', 'Exceptions.',
                'Client intelligence.', 'Ways of solving problems.', 'Things you believe.',
                'Things you refuse to do.',
                'Things experience taught you that no generic prompt could possibly know.',
              ]} />
            </div>

            <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-0">
              <div className="space-y-5 text-[1.05rem] leading-[1.75] lg:pr-14">
                <p>
                  And because you have been living inside that intelligence for years,
                  some of the most valuable parts have become almost invisible to you.
                </p>
                <p>You don&rsquo;t necessarily think: <em className="nr">&ldquo;That&rsquo;s intellectual property.&rdquo;</em></p>
                <p>You think: <em className="nr">&ldquo;Obviously I&rsquo;d do it this way.&rdquo;</em></p>
              </div>
              <div className="flex flex-col justify-center space-y-5 text-[1.05rem] leading-[1.75] lg:border-l lg:border-[color:var(--hair)] lg:pl-14">
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
          <div className={WRAP}>
            <h2 className="nr max-w-[17em] text-[2.2rem] leading-[1.08] md:text-[3rem]">
              The internet does not need another thousand pieces of AI-generated sameness.
              It needs the thinking you earned <em>before the machine arrived.</em>
            </h2>
            <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-0">
              <div className="lg:pr-14">
                <Ledger items={[
                  'The lesson you learned after the client project went spectacularly wrong.',
                  'The pattern you’ve seen across 300 customers.',
                  'The strange question you always ask that gets to the answer faster.',
                  'The framework that evolved slowly across ten years.',
                  'The opinion you arrived at after changing your mind three times.',
                  'The judgement your team keeps borrowing from you.',
                  'The insight you gave spontaneously on a Zoom call and then forgot you ever said.',
                ]} />
              </div>
              <div className="flex flex-col justify-center space-y-5 text-[1.05rem] leading-[1.75] lg:border-l lg:border-[color:var(--hair)] lg:pl-14">
                <p className="nr text-[1.7rem] leading-[1.35]">That is the good stuff.</p>
                <p className="nr text-[1.7rem] leading-[1.35]">That is what makes the business <em>yours.</em></p>
                <p>And now we have technology capable of helping us do radically more with it.</p>
                <p>Not replace it.</p>
                <p>Not flatten it.</p>
                <p>Not generate a cheaper imitation of it.</p>
                <p className="nr rose-beat text-[2.2rem]"><em>Use it.</em></p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 05 ────────────────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="05">Not actually new</ChapterHead>
        <section className="px-6 pt-12 pb-16">
          <div className={WRAP}>
            <h2 className="nr max-w-[16em] text-[2.2rem] leading-[1.08] md:text-[3rem]">
              What if the most exciting thing AI helps you create next&hellip; <em>isn&rsquo;t actually new?</em>
            </h2>
            <div className="stagger mt-12 grid border-y border-[color:var(--ink)]/30 sm:grid-cols-2 sm:divide-x sm:divide-[color:var(--hair)] lg:grid-cols-3">
              {[
                'Maybe an old programme becomes an interactive client experience that can guide someone through your methodology while they’re implementing it.',
                'Maybe hundreds of client calls reveal patterns you’ve never had the ability to see across the whole body of work.',
                'Maybe years of content become something you can actually question, connect and build from instead of a graveyard of posts you vaguely remember writing.',
                'Maybe the questions you’ve answered repeatedly become intelligent support your clients can access without waiting five days for your next call.',
                'Maybe the judgement your team borrows from you becomes clear enough that they can make more of those calls themselves.',
                'Maybe something you created years ago becomes commercially valuable again because the technology around it has finally caught up.',
              ].map((t, i) => (
                <div key={t} className="flex flex-col gap-4 py-8 sm:px-8 sm:first:pl-0">
                  <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-[1.02rem] leading-[1.7]">{t}</p>
                </div>
              ))}
            </div>
            <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end">
              <div className="nr max-w-[26em] text-[1.6rem] leading-[1.4]">
                <p>And maybe, once you can see what is actually inside this business&hellip;</p>
                <p className="mt-3">you stop feeling like you need to keep <em>inventing from scratch.</em></p>
              </div>
              <p className="max-w-[30em] text-[1.02rem] leading-[1.7] text-[color:var(--ink)]/75 lg:justify-self-end">
                Old work becomes newly useful when the surrounding technology catches up.
              </p>
            </div>
          </div>
        </section>

        <Ticker items={['Find it.', 'Honour it.', 'Make it usable.', 'Then add the leverage.']} dark />

        {/* ── 06 · This is Envisioned ───────────────────────────────── */}
        <Rule />
        <ChapterHead n="06">This is Envisioned</ChapterHead>
        <section className="px-6 pt-12 pb-20">
          <div className={WRAP}>
            <h2 className="nr text-[2.2rem] leading-[1.08] md:text-[3.1rem]">This is Envisioned.</h2>
            <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <p className="text-[1.05rem] leading-[1.75]">We work with established founders who have already built something worth making more usable.</p>
                <div className="mt-6">
                  <Sheet cols={2} items={[
                    'You have expertise.', 'You have a body of work.',
                    'You have methodologies.', 'You have years of client experience.',
                    'You have opinions.', 'Standards.', 'Decisions.', 'Intellectual property.',
                    'Probably enough folders to qualify as a small archaeological site.',
                  ]} />
                </div>
                <p className="mt-8 text-[1.05rem] leading-[1.75]">What you may not have is a way for the business to see, connect and use all of that intelligence.</p>
                <p className="nr mt-4 text-[1.5rem] text-[color:var(--ox)]">That is where we come in.</p>
              </div>
              <Image src="/img/city-cafe.jpg" alt="Espresso at a café table in the city" width={720} height={520} className="h-full w-full object-cover" />
            </div>

            <p className="nr mt-20 text-[2rem] md:text-[2.6rem]">Find it. Organise it. <em>Put it to work.</em></p>
            <div className="stagger mt-10 grid border-t-2 border-[color:var(--ink)] sm:grid-cols-3 sm:divide-x sm:divide-[color:var(--hair)]">
              <div className="py-6 sm:pr-10">
                <p className="lbl text-[color:var(--ox)]">We find it</p>
                <div className="mt-4 space-y-4 text-[1.02rem] leading-[1.7]">
                  <p>We go looking across the business you&rsquo;ve already built. Not only at the polished assets.</p>
                  <p>The recordings. The client work. The old programmes. The messy documents. The repeated questions. The exceptions. The decisions. The things you say casually that turn out to explain half your method.</p>
                </div>
              </div>
              <div className="py-6 sm:px-10">
                <p className="lbl text-[color:var(--ox)]">We organise it</p>
                <div className="mt-4 space-y-4 text-[1.02rem] leading-[1.7]">
                  <p>We make the valuable thinking visible enough to work with.</p>
                  <p>Not another dumping ground. Not a gigantic folder called &ldquo;knowledge base&rdquo; that nobody opens.</p>
                  <p>We create enough structure for the intelligence to become usable.</p>
                </div>
              </div>
              <div className="py-6 sm:pl-10">
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
        <section id="founder-intelligence-name" className="px-6 pt-20 pb-28">
          <div className={`${WRAP} relative`}>
            <span aria-hidden="true" className="num pointer-events-none absolute -top-10 right-0 select-none text-[8rem] leading-none text-[color:var(--stone)] md:text-[15rem]">07</span>
            <p className="lbl relative text-[color:var(--ox)]">A name for it</p>
            <p className="relative mt-10 text-[1.05rem]">There&rsquo;s a name for what we&rsquo;re uncovering.</p>
            <h2 className="nr relative mt-4 text-[3.2rem] leading-[0.98] md:text-[6.4rem]">Founder Intelligence.</h2>
            <div className="mt-24 grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="space-y-4 text-[1.05rem] leading-[1.8]">
                  <p>It&rsquo;s the accumulated thinking behind the business.</p>
                  <p>Not simply what you know.</p>
                  <p className="nr text-[1.6rem]"><em>How</em> you know what to do.</p>
                </div>
                <div className="mt-10">
                  <Ledger tight items={[
                    'How you recognise quality.',
                    'How you interpret context.',
                    'How you adapt your methodology.',
                    'How you make trade-offs.',
                    'How you know when the normal rule does not apply.',
                    'How you see things other people miss.',
                    'How you make the work yours.',
                  ]} />
                </div>
              </div>
              <div className="space-y-5 text-[1.05rem] leading-[1.8] lg:col-span-4 lg:col-start-9 lg:pt-32">
                <p>Most businesses document the visible layer.</p>
                <p>The task. The process. The checklist. Useful.</p>
                <p>But the most valuable businesses have another layer underneath:</p>
                <p>the intelligence responsible for making the process work well.</p>
                <p className="nr pt-2 text-[1.5rem] leading-[1.35] text-[color:var(--ox)]">That is the layer we are after.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 08 ────────────────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="08">Information is not intelligence</ChapterHead>
        <section className="px-6 pt-12 pb-20">
          <div className={WRAP}>
            <h2 className="nr max-w-[17em] text-[2.2rem] leading-[1.08] md:text-[3rem]">
              Because having the information is not the same as being able to <em>use the intelligence.</em>
            </h2>
            <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-0">
              <div className="lg:pr-14">
                <Ledger items={[
                  'You can have the SOP and still need the founder.',
                  'You can have the course and still need the founder.',
                  'You can have the brand guide and still produce work that feels completely wrong.',
                  'You can have every podcast episode archived and still have no idea what you said about a particular subject three years ago.',
                  'You can upload twenty files to AI and still receive an answer that makes you think:',
                ]} />
                <p className="nr pt-5 text-[1.6rem]"><em>Technically fine. Absolutely not.</em></p>
              </div>
              <div className="flex flex-col justify-center space-y-5 text-[1.05rem] leading-[1.75] lg:border-l lg:border-[color:var(--hair)] lg:pl-14">
                <p>The problem isn&rsquo;t always missing information.</p>
                <p>Sometimes the business is drowning in information.</p>
                <p className="nr text-[1.7rem]">The missing layer is <em>context.</em></p>
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
          <div className={WRAP}>
            <h2 className="nr max-w-[15em] text-[2.2rem] leading-[1.08] md:text-[3rem]">
              And this is where AI gets <em>genuinely exciting.</em>
            </h2>
            <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-0">
              <div className="space-y-5 text-[1.05rem] leading-[1.75] lg:pr-14">
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
              <div className="lg:border-l lg:border-[color:var(--hair)] lg:pl-14">
                <div className="space-y-5 text-[1.05rem] leading-[1.75]">
                  <p className="nr text-[1.6rem] leading-[1.4]">AI has changed the economics of leverage.</p>
                  <p className="nr text-[1.6rem] leading-[1.4]">And I want more <em>women</em> using that leverage.</p>
                  <p>Not because every woman needs to become obsessed with artificial intelligence.</p>
                  <p>Not because technology deserves another fan club.</p>
                  <p>
                    Because when we understand these tools well enough to use them
                    consciously, we get to decide what we do with the leverage.
                  </p>
                </div>
                <div className="mt-8">
                  <Ledger tight items={[
                    'What we build.', 'Who we help.', 'Whose ideas travel.',
                    'Whose methodologies become more accessible.',
                    'Whose businesses become more capable.',
                    'Whose intelligence gets represented in the systems people increasingly use to work, learn and make decisions.',
                  ]} />
                </div>
                <p className="nr mt-8 text-[1.6rem]">That matters to me. <em>A lot.</em></p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 10 ────────────────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="10">What becomes possible</ChapterHead>
        <section className="px-6 pt-12 pb-20">
          <div className={WRAP}>
            <h2 className="nr max-w-[16em] text-[2.2rem] leading-[1.08] md:text-[3rem]">
              You do not need to become an AI expert. But I do want you to know <em>what becomes possible.</em>
            </h2>
            <div className="mt-12 max-w-[36em] space-y-6 text-[1.05rem] leading-[1.75]">
              <p>Because there is a huge difference between:</p>
              <p className="nr border-l-2 border-[color:var(--hair)] pl-6 text-[1.5rem]">&ldquo;Look what AI can make.&rdquo;</p>
              <p>and:</p>
              <p className="nr border-l-2 border-[color:var(--ox)] pl-6 text-[1.7rem] text-[color:var(--ox)]">&ldquo;Look what AI can make possible <em>with what I already know.</em>&rdquo;</p>
              <p>That second question is where Envisioned lives.</p>
            </div>
          </div>
        </section>

        {/* ── 11 · When it becomes usable ───────────────────────────── */}
        <Rule />
        <GhostHead n="11" kicker="When it becomes usable" title={<>When your intelligence becomes usable, <em>the business changes.</em></>} />
        <section className="px-6 pt-16 pb-28">
          <div className={WRAP}>
            <div className="stagger mt-10 grid gap-x-20 gap-y-24 sm:grid-cols-2">
              {[
                ['01', 'Your clients get more of what they actually hired you for.',
                  'Not simply access to more information. More of the judgement behind the information. More help applying what you teach when the real-world situation refuses to fit neatly inside the example from Module Four.'],
                ['02', 'Your team stops having to reverse-engineer you.',
                  'They can access more of the context behind your decisions instead of following the process until something unusual happens and then sending the whole problem back upstairs.'],
                ['03', 'Your body of work starts working again.',
                  'Old workshops stop being old workshops. Content stops disappearing the day after you publish it. Past client conversations become usable intelligence. Ideas start connecting across years instead of living in separate digital boxes.'],
                ['04', 'AI stops starting from zero.',
                  'It has something far more useful than another clever prompt. It has context. Your language. Your thinking. Your standards. Your examples. Your methodology. Something distinctly yours to reason with.'],
              ].map(([n, h, body], i) => (
                <div key={n} className={i % 2 === 1 ? 'sm:mt-28' : ''}>
                  <p aria-hidden="true" className="num select-none text-[5.5rem] leading-none text-[color:var(--stone)]">{n}</p>
                  <p className="nr mt-5 max-w-[16em] text-[1.55rem] leading-[1.2]">{h}</p>
                  <p className="mt-4 max-w-[30em] text-[1.02rem] leading-[1.75]">{body}</p>
                </div>
              ))}
            </div>
            <div className="mx-auto mt-32 max-w-[36em] space-y-5 text-[1.05rem] leading-[1.8]">
              <p className="fx-rv nr text-[1.9rem] leading-[1.25]">And you get to see the business <em>differently.</em></p>
              <p>This is one of my favourite parts.</p>
              <p>Because sometimes we go looking for one thing&hellip; and find something else entirely.</p>
              <p>
                An opportunity. An offer. A connection. A method hiding inside what looked
                like a collection of unrelated decisions. A piece of intellectual property
                that has been there for years without anybody recognising what it could become.
              </p>
              <p>We don&rsquo;t always know what we&rsquo;re going to find.</p>
              <p className="nr pt-2 text-[1.5rem] text-[color:var(--ox)]"><em>That&rsquo;s rather the point.</em></p>
            </div>
          </div>
        </section>

        <Ticker items={['Codified in the City', 'Your intelligence. Made usable.']} dark />

        {/* ── CITC band ─────────────────────────────────────────────── */}
        <section id="citc" className="relative overflow-hidden">
          <div data-px className="relative h-[560px] w-full overflow-hidden">
            <Image src="/img/atmosphere-terrace.jpg" alt="Terrace table in Mediterranean light" fill className="object-cover" />
            <div className="absolute inset-0 bg-[#1E1E1E]/55" />
            <div className="absolute inset-0 flex items-center px-6">
              <div className="mx-auto w-full max-w-[1280px]">
                <p className="lbl text-[#E8C4A8]">The hero experience</p>
                <h2 className="nr mt-4 max-w-[12em] text-[2.6rem] leading-[1.05] text-[#FBFAF9] md:text-[3.8rem]">
                  Codified in the City
                </h2>
                <p className="nr mt-6 max-w-[24em] text-[1.3rem] leading-[1.5] text-[#FBFAF9] md:text-[1.6rem]">
                  One private day to discover what your business already knows — and put
                  the most valuable part of it to work.
                </p>
                <p className="photo-em mt-4 max-w-[30em] text-[1.05rem] text-[#FBFAF9]/85">
                  One private day. Your real intelligence. A working system. <em className="nr">The lunch is part of the point.</em>
                </p>
                <a href={CITC_MAILTO} className="lbl mt-8 inline-block bg-[color:var(--ox)] px-6 py-3 text-[#FBFAF9] transition-opacity hover:opacity-90">
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
          <div className={WRAP}>
            <h2 className="nr max-w-[16em] text-[2.2rem] leading-[1.08] md:text-[3rem]">
              Begin with the part that needs to become <em>usable first.</em>
            </h2>
            <div className="stagger mt-12 grid border-t-2 border-[color:var(--ink)] sm:grid-cols-3 sm:divide-x sm:divide-[color:var(--hair)]">
              <div className="flex flex-col py-8 sm:pr-8">
                <p className="lbl text-[color:var(--ox)]">One</p>
                <p className="nr mt-4 text-[1.55rem] leading-[1.25]">Not ready for the full build? Start with The Integration Map.</p>
                <p className="mt-4 flex-1 text-[1.02rem] leading-[1.7]">
                  Sometimes you know there is value everywhere. You just cannot tell which
                  part deserves your attention first.
                </p>
                <a href={MAP_MAILTO} className="lbl mt-6 text-[color:var(--ink)] transition-colors hover:text-[color:var(--ox)]">
                  Start with the Map →
                </a>
              </div>
              <div className="flex flex-col py-8 sm:px-8">
                <p className="lbl text-[color:var(--ox)]">Two</p>
                <p className="nr mt-4 text-[1.55rem] leading-[1.25]">Already building? Stay for The Residency.</p>
                <p className="mt-4 flex-1 text-[1.02rem] leading-[1.7]">
                  The interesting thing about making one part of the business more
                  intelligent is that you start noticing all the other places where the
                  same thinking could travel.
                </p>
                <a href={RES_MAILTO} className="lbl mt-6 text-[color:var(--ink)] transition-colors hover:text-[color:var(--ox)]">
                  Ask about The Residency →
                </a>
              </div>
              <div className="flex flex-col py-8 sm:pl-8">
                <p className="lbl text-[color:var(--ox)]">Three</p>
                <p className="nr mt-4 text-[1.55rem] leading-[1.25]">For the businesses ready to go deeper: Embedded Genius</p>
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
          <div className={WRAP}>
            <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
              <div>
                <h2 className="nr text-[2.2rem] leading-[1.08] md:text-[3rem]">
                  This is probably for you if&hellip;
                </h2>
                <p className="nr mt-10 text-[1.7rem]">Good.</p>
                <p className="nr text-[1.7rem] text-[color:var(--ox)]"><em>That is exactly where I like to start.</em></p>
              </div>
              <Ledger items={[
                'You’ve been in business long enough to know you have more valuable material than you know what to do with.',
                'You have a proven methodology, distinctive expertise or body of work that people already pay for.',
                'You’ve started experimenting with AI and can see the potential — but you’re underwhelmed by generic outputs and increasingly allergic to generic advice.',
                'You’re less interested in “100 prompts to save five hours a week” and more interested in what becomes possible when technology actually understands your business.',
                'You care about protecting what makes your work yours.',
                'You want your team and clients to benefit from more of what you know.',
                'And you have a sneaking suspicion that some of the best things you’ll build next may already be hiding inside what you built before.',
              ]} />
            </div>
          </div>
        </section>

        {/* ── About ─────────────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="14">About</ChapterHead>
        <section id="about" className="px-6 pt-12 pb-20">
          <div className={`${WRAP} grid gap-14 lg:grid-cols-[1fr_1.2fr]`}>
            <div>
              <Image src="/img/portrait-mi.jpg" alt="Maria-Ines, portrait in warm light with natural curls" width={720} height={900} className="w-full object-cover" />
              <p className="lbl mt-4 text-[color:var(--ink)]/70">Pattern spotter. Strategist. Builder.</p>
            </div>
            <div className="space-y-5 text-[1.05rem] leading-[1.75]">
              <h2 className="nr text-[2.4rem] leading-[1.1] md:text-[3rem]">I&rsquo;m Maria-Ines.</h2>
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
              <div className="pt-2">
                <Ledger tight items={[
                  'We build differently.', 'We help differently.', 'We participate differently.',
                  'We create opportunities that weren’t available before.',
                  'And we get to imagine forms of impact that previously required resources many of us simply did not have.',
                ]} />
              </div>
              <p className="nr pt-3 text-[1.5rem] text-[color:var(--ox)]">That is the future I&rsquo;m interested in.</p>
            </div>
          </div>
        </section>

        {/* ── Closing ───────────────────────────────────────────────── */}
        <Rule />
        <section className="px-6 pt-16 pb-8">
          <div className={WRAP}>
            <div className="max-w-[38em] space-y-5 text-[1.05rem] leading-[1.75]">
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

        <section className="dk bg-[color:var(--char)] px-6 py-24 text-[#FBFAF9]">
          <div className={WRAP}>
            <p className="nr text-[1.4rem] text-[#FBFAF9]/80">And after that?</p>
            <h2 className="nr mt-3 max-w-[14em] text-[2.6rem] leading-[1.08] md:text-[3.8rem]">
              Let&rsquo;s see what becomes <em>possible.</em>
            </h2>
            <p className="mt-8 max-w-[30em] text-[1.1rem] leading-[1.7] text-[#FBFAF9]/85">
              Your business is already sitting on extraordinary value. We find it,
              organise it and put it to work.
            </p>
            <a href={CITC_MAILTO} className="lbl mt-10 inline-block bg-[color:var(--ox)] px-7 py-3.5 text-[#FBFAF9] transition-opacity hover:opacity-90">
              Explore Codified in the City ↗
            </a>
            <div className="mt-20 flex flex-col gap-3 border-t border-[#FBFAF9]/20 pt-8 md:flex-row md:items-baseline md:justify-between">
              <div>
                <p className="nr text-[1.3rem]">Envisioned Brands</p>
                <p className="lbl mt-1 text-[#FBFAF9]/60">Your intelligence. Made usable.</p>
              </div>
              <div className="lbl flex flex-wrap gap-x-8 gap-y-2 text-[#FBFAF9]/70">
                {[
                  ['01', 'Founder Intelligence', '#founder-intelligence'],
                  ['02', 'Codified in the City', '#citc'],
                  ['03', 'Ways to Work', '#ways-to-work'],
                  ['04', 'About', '#about'],
                ].map(([n, label, href]) => (
                  <a key={label} href={href} className="flex items-baseline gap-2 hover:text-[#FBFAF9]">
                    <span className="text-[0.6rem] text-[#FBFAF9]/40">{n}</span>{label}
                  </a>
                ))}
                <a href="mailto:hello@mariaines.co" className="hover:text-[#FBFAF9]">hello@mariaines.co</a>
                <a href="https://app.envisioned.me/login" title="Studio login" className="hover:text-[#FBFAF9]">Studio</a>
              </div>
            </div>
            <p className="lbl mt-8 text-[#FBFAF9]/40">© 2026 Envisioned Brands · Written, built and run from Europe.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
