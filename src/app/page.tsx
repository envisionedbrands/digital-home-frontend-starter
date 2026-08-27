import Image from 'next/image';
import HomeFx from '@/components/home-fx';
import { NAV_LEFT, NAV_RIGHT, STUDIO, PRIMARY_CTA } from '@/lib/nav';

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

/**
 * Every offer CTA books a real slot — no mailto anywhere. The booking page is
 * native (src/app/book/[slug]), backed by booking_event_types in Supabase, so
 * the only times shown are times she is genuinely available.
 * Codified in the City has its own site, so it links there instead.
 */
const BOOK = '/book/envisioned-match';
const CITC_HREF = 'https://codifiedinthecity.com';

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

/**
 * ONE chapter opener for the whole page, modelled on section 07 — the one MI
 * singled out. Ghost numeral bled right, Courier kicker, then the display line.
 * Everything routes through this, so the numerals are a single size and every
 * opener starts on the same left edge. Previously 02 was visibly larger than 03
 * because they were two different components with different scales.
 */
function Opener({ n, kicker, title }: { n: string; kicker?: React.ReactNode; title?: React.ReactNode }) {
  return (
    <div className={`${WRAP} relative px-6 pt-28 md:pt-40`}>
      <span
        aria-hidden="true"
        className="num pointer-events-none absolute -top-4 right-0 select-none text-[5.5rem] leading-none text-[color:var(--stone)] md:-top-12 md:text-[12rem]"
      >
        {n}
      </span>
      {kicker && <p className="lbl relative text-[color:var(--ox)]">{kicker}</p>}
      {title && (
        <h2 className="nr relative mt-8 max-w-[13em] text-balance text-[2.1rem] leading-[1.09] md:mt-12 md:text-[3.6rem]">
          {title}
        </h2>
      )}
    </div>
  );
}

/** Kicker-only opener (kept so existing call sites read the same). */
function ChapterHead({ n, children }: { n: string; children: React.ReactNode }) {
  return <Opener n={n} kicker={children} />;
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
        <div className="relative mx-auto grid h-[64px] max-w-[1360px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-6">
          <nav className="hidden items-center justify-end gap-8 pr-8 lg:flex">
            {NAV_LEFT.map(({ n, label, href }) => (
              <a key={label} href={href} className="lbl flex items-baseline gap-2 text-[#FBFAF9]/85 transition-colors hover:text-[#FBFAF9]">
                <span className="text-[0.6rem] text-[#FBFAF9]/50">{n}</span>
                {label}
              </a>
            ))}
          </nav>
          <a href="#top" aria-label="Envisioned by Maria-Ines — back to top" className="justify-self-center">
            <Image src="/img/logo-envisioned-white.png" alt="" width={150} height={54} className="h-[36px] w-auto" />
          </a>
          <div className="flex items-center justify-start gap-6 pl-8">
            <nav className="hidden items-center gap-6 lg:flex">
              {NAV_RIGHT.map(({ n, label, href }) => (
                <a key={label} href={href} className="lbl flex items-baseline gap-2 text-[#FBFAF9]/85 transition-colors hover:text-[#FBFAF9]">
                  <span className="text-[0.6rem] text-[#FBFAF9]/50">{n}</span>
                  {label}
                </a>
              ))}
            </nav>
            <a href={STUDIO.href} title="Studio login" className="lbl text-[#FBFAF9]/55 transition-colors hover:text-[#FBFAF9]">
              {STUDIO.label}
            </a>
            <a href={PRIMARY_CTA.href} className="lbl whitespace-nowrap bg-[color:var(--ox)] px-4 py-2.5 text-[#FBFAF9] transition-opacity hover:opacity-90">
              {PRIMARY_CTA.label}
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
            <div className="photo-em relative flex w-full max-w-[1080px] flex-1 flex-col items-center justify-center text-center">
              <h1 className="h-b nr w-full leading-[1.14] text-[#FBFAF9]">
                <span className="block whitespace-nowrap text-[clamp(1.05rem,4.1vw,3.1rem)]">
                  You own a proven body of work.
                </span>
                <em className="mt-1 block whitespace-nowrap text-[clamp(1.05rem,4.1vw,3.1rem)]">
                  None of it is doing any work for you.
                </em>
              </h1>
              <p
                className="typeband hero-tw h-c mt-10 min-h-[1.6em] text-[1.3rem] text-[#FBFAF9]/95 md:text-[1.85rem]"
                data-typewriter='["Years of ideas.","Client conversations.","Methodologies.","Decisions.","Workshops.","Content.","Frameworks.","Patterns you notice without even realising you notice them anymore."]'
              >
                Years of ideas.
              </p>
              <p className="h-e nr mt-10 text-balance text-[clamp(1.1rem,2.3vw,1.75rem)] text-[#FBFAF9]">
                All of it filed away. <em>None of it earning its keep.</em>
              </p>
              <p className="h-e mt-8 max-w-[36em] text-[1.05rem] leading-[1.75] text-[#FBFAF9]/85 md:text-[1.15rem]">
                Meanwhile the most sophisticated tool you have ever had access to is being
                asked to help you from a blank chat box, every morning, knowing nothing
                about any of it.
              </p>
              <a
                href={PRIMARY_CTA.href}
                className="pointer-events-auto h-d lbl mt-14 inline-flex items-center gap-2 bg-[color:var(--ox)] px-7 py-4 text-[#FBFAF9] shadow-[0_12px_34px_-14px_rgba(30,30,30,0.85)] transition-opacity hover:opacity-90"
              >
                Start with the Integration Map <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          {/* The two cover frames overlap rather than queue: the first PINS
               (sticky) while the second scrolls up over the top of it, so the
               second image reveals itself across the first instead of following
               it. Later sibling in the DOM paints above the sticky one. */}
          <div className="relative z-0 -mt-[100vh]">
            <div className="sticky top-0 h-screen overflow-hidden">
              <Image src="/img/hero-postcard.jpg" alt="Tuscan window with shutters, espresso and notebook in golden morning light" fill priority className="hero-zoom object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(30,30,30,0.52) 0%, rgba(30,30,30,0.30) 45%, rgba(30,30,30,0.58) 100%)' }} />
            </div>
            <div className="relative h-[95vh] overflow-hidden shadow-[0_-40px_80px_-20px_rgba(30,30,30,0.55)]">
              <Image src="/img/movement-drive.jpg" alt="Driving through the Tuscan countryside" fill className="object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(30,30,30,0.55) 0%, rgba(30,30,30,0.35) 50%, rgba(30,30,30,0.62) 100%)' }} />
            </div>
          </div>
        </section>

        {/* The thesis, stated once, at full size, before any argument begins.
             Moved here from chapter 02 at MI's request — it was doing quiet work
             in a side column when it is the whole point of the page. */}
        <section className="px-6 py-40 text-center md:py-64">
          <div className={WRAP}>
            <p className="fx-rv nr text-[2.6rem] leading-[1.04] md:text-[5.2rem]">You do not need more AI.</p>
            <p className="fx-rv nr mt-3 text-[2.6rem] leading-[1.04] text-[color:var(--ox)] md:mt-5 md:text-[5.2rem]">
              <em>AI needs more of you.</em>
            </p>
            <p className="mx-auto mt-16 max-w-[34em] text-[1.05rem] leading-[1.85] md:mt-20 md:text-[1.15rem]">
              So stop blaming it for the slop. If you do not give it substantial context,
              it will fill the gaps with the average of everyone else&rsquo;s.
            </p>
          </div>
        </section>

        <section className="px-6 py-40 md:py-56">
          <div className={`${WRAP} grid gap-20 lg:grid-cols-12 lg:items-end lg:gap-14`}>
            <div className="lg:col-span-7">
              <p className="text-[1.05rem] leading-[1.8]">You have already done the hard part.</p>
              <p className="text-[1.05rem] leading-[1.8]">You earned the intelligence.</p>
              <p className="fx-rv nr mt-20 max-w-[12em] text-balance text-[2.6rem] leading-[1.08] md:mt-28 md:text-[4rem]">
                Now the business needs to learn how to <em>carry it.</em>
              </p>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <Image src="/img/hero-desk.jpg" alt="Desk with notebook and coffee in warm light" width={640} height={460} className="w-full object-cover" />
            </div>
          </div>
        </section>

        <div className="px-6 py-24 text-center md:py-32">
          <p className="nr text-[1.7rem] text-[color:var(--ox)] md:text-[2.2rem]">Founder intelligence, made usable.</p>
          <p className="lbl mt-4 text-[color:var(--ink)]/45">E / B</p>
        </div>

        {/* ── 02 ────────────────────────────────────────────────────── */}
        <Rule />
        <Opener n="02" kicker="What the machine cannot see" title={<>What AI cannot see, <em>it replaces.</em></>} />
        <section className="px-6 pt-14 pb-32 md:pb-44">
          <div className={WRAP}>
            <p className="text-[1.05rem]">AI will not leave the unknown parts of your business untouched. It will guess.</p>
            <div className="mt-6">
              <Sheet cols={3} items={[
                'Your judgement.', 'Your standards.', 'Your taste.',
                'Your exceptions.', 'Your instincts.', 'Your hard-won ways of seeing.',
                'Every part you have never articulated gets quietly replaced by probability.',
              ]} />
            </div>

            <div className="mt-24 grid gap-12 lg:grid-cols-12">
              <div className="space-y-5 text-[1.05rem] leading-[1.8] lg:col-span-5">
                <p>And probability pulls everything towards the middle.</p>
                <p>
                  The language sounds polished, but not like you. The decision looks
                  reasonable, but it is not the decision you would make. The work is
                  technically correct, and unmistakably generic. That is how ten years of
                  earned intelligence gets sanded down into something anybody could have
                  produced.
                </p>
              </div>
              <div className="space-y-5 text-[1.05rem] leading-[1.8] lg:col-span-4 lg:col-start-8 lg:pt-28">
                <p>Codification is how you stop the machine from averaging the genius out of your business.</p>
                <p>Your intelligence is everywhere.</p>
                <p>Except where it can work.</p>
              </div>
            </div>

            {/* The chapter's one pull moment — pinned while photography
                 passes over it (the Aperol move). Courier-italic accent trial. */}
            <div className="relative -mx-6 lg:mx-0">
              <div className="sticky top-0 z-10 flex h-screen items-center justify-center px-6">
                <p className="quote-tw nr mx-auto max-w-[1080px] text-center text-[2.4rem] leading-[1.14] md:text-[3.6rem]">
                  Your business is surrounded by its own intelligence.<br />
                  <em>And still cannot reach it.</em>
                </p>
              </div>
              {/* The frames pass BESIDE the pinned line, never across it: they sit
                   behind (z-0) and are inset from the centre column, so the quote
                   is never covered while it is pinned. */}
              <div className="pointer-events-none relative -z-10 -mt-[100vh]">
                <div className="flex h-[75vh] items-start pt-[8vh] pl-[4%]">
                  <Image src="/img/hero-desk.jpg" alt="Desk with notebook and coffee in warm light" width={420} height={300} className="w-[240px] border border-[color:var(--ink)]/15 object-cover md:w-[380px]" />
                </div>
                <div className="flex h-[80vh] items-end justify-end pb-[10vh] pr-[5%]">
                  <Image src="/img/city-cafe.jpg" alt="Espresso at a café table in the city" width={460} height={330} className="w-[260px] border border-[color:var(--ink)]/15 object-cover md:w-[420px]" />
                </div>
                <div className="flex h-[70vh] items-start justify-start pt-[6vh] pl-[10%]">
                  <Image src="/img/lived-intelligence.jpg" alt="Working across a table, marking up documents" width={420} height={300} className="w-[230px] border border-[color:var(--ink)]/15 object-cover md:w-[360px]" />
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-[36em] space-y-5 text-[1.05rem] leading-[1.8]">
              <p>Inside the masterclass you taught four years ago.</p>
              <p>Inside the client call where you explained it better than you ever have, and then forgot you said it.</p>
              <p>Inside two hundred pieces of content and twelve years of decisions.</p>
              <p>Inside a methodology that evolved so gradually you no longer notice half of what makes it exceptional.</p>
              <p className="nr pt-6 text-[1.6rem] leading-[1.35]">So the work keeps <em>returning to you.</em></p>
            </div>
          </div>
        </section>

        {/* Act break */}
        <div data-px className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
          <Image src="/img/lived-intelligence.jpg" alt="Working across a table, marking up documents" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#1E1E1E]/45" />
          <p className="photo-em nr absolute inset-x-6 bottom-10 mx-auto max-w-[1280px] text-[1.5rem] text-[#FBFAF9] md:text-[2rem]">
            Judgement. Context. Standards. <em>The invisible architecture underneath.</em>
          </p>
        </div>

        {/* ── 03 ────────────────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="03">Everywhere except where it can work</ChapterHead>
        <section className="px-6 pt-14 pb-32 md:pb-44">
          <div className={WRAP}>
            <h2 className="nr max-w-[13em] text-balance text-[2.1rem] leading-[1.09] md:text-[3.6rem]">
              Your intelligence is everywhere. <em>Except where it can work.</em>
            </h2>

            <p className="mt-16 text-[1.05rem] md:mt-20">It is inside the way you work, not the files you keep.</p>
            <div className="mt-6">
              <Sheet cols={3} items={[
                'The way you recognise quality.',
                'The question you ask when everybody else is looking in the wrong direction.',
                'The exception you spot before the process breaks.',
                'The decision your team keeps bringing back to you.',
                'The standards you protect without being asked.',
                'The trade-off you make without noticing you made it.',
              ]} />
            </div>

            <div className="mt-20 grid gap-14 md:mt-28 lg:grid-cols-2 lg:gap-0">
              <div className="space-y-5 text-[1.05rem] leading-[1.75] lg:pr-14">
                <p>Your team can follow the process until something unusual happens.</p>
                <p>
                  Your clients can access the programme until real life refuses to
                  resemble Module Four.
                </p>
                <p>Your AI can read the files and still produce something that makes you think:</p>
              </div>
              <div className="flex flex-col justify-center space-y-5 text-[1.05rem] leading-[1.75] lg:border-l lg:border-[color:var(--hair)] lg:pl-14">
                <p className="nr text-[1.7rem] leading-[1.35]"><em>Technically fine. Absolutely not.</em></p>
                <p>You are not short on ideas. You are not bad at execution.</p>
                <p className="nr text-[1.5rem] leading-[1.4] text-[color:var(--ox)]">
                  And you are not the problem your business needs to remove.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 04 ────────────────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="04">What the business has never learned to carry</ChapterHead>
        <section className="px-6 pt-14 pb-32 md:pb-44">
          <div className={WRAP}>
            <h2 className="nr max-w-[13em] text-balance text-[2.1rem] leading-[1.09] md:text-[3.6rem]">
              The infrastructure around you has simply never learned how to
              <em> carry what you know.</em>
            </h2>
            <div className="mt-20 grid gap-16 md:mt-28 lg:grid-cols-[1.15fr_1fr] lg:gap-0">
              <div className="lg:pr-14">
                <Ledger items={[
                  'Documents are evidence of it.',
                  'Processes are expressions of it.',
                  'Content leaves traces of it.',
                  'Most businesses document the visible layer: the task, the process, the checklist.',
                  'Useful, but incomplete.',
                  'Because someone can follow every step and still miss the judgement that makes the result good.',
                ]} />
              </div>
              <div className="flex flex-col justify-center space-y-5 text-[1.05rem] leading-[1.75] lg:border-l lg:border-[color:var(--hair)] lg:pl-14">
                <p>
                  You have lived inside that judgement for so long that its most valuable
                  parts may be almost invisible to you.
                </p>
                <p>You do not think, <em className="nr">&ldquo;That is intellectual property.&rdquo;</em></p>
                <p>You think, <em className="nr">&ldquo;Obviously I would do it this way.&rdquo;</em></p>
                <p>Except it is not obvious. It is obvious to you.</p>
                <p className="nr rose-beat text-[2rem]">That distinction is where <em>Envisioned begins.</em></p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 05 ────────────────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="05">Temporary tools, permanent work</ChapterHead>
        <section className="px-6 pt-14 pb-32 md:pb-44">
          <div className={WRAP}>
            <h2 className="nr max-w-[13em] text-balance text-[2.1rem] leading-[1.09] md:text-[3.6rem]">
              Your tools are temporary. <em>Your body of work is not.</em>
            </h2>
            <div className="stagger mt-12 grid border-y border-[color:var(--ink)]/30 sm:grid-cols-2 sm:divide-x sm:divide-[color:var(--hair)] lg:grid-cols-3">
              {[
                'Platforms change their pricing, permissions, policies and capabilities.',
                'Products disappear. Models improve.',
                'The tool that feels indispensable today may be irrelevant two years from now.',
                'Platforms can rent you convenience.',
                'They should not own the only usable copy of your intelligence.',
                'Envisioned builds platform-agnostically wherever possible.',
              ].map((t, i) => (
                <div key={t} className="flex flex-col gap-4 py-8 sm:px-8 sm:first:pl-0">
                  <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-[1.02rem] leading-[1.7]">{t}</p>
                </div>
              ))}
            </div>
            <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end">
              <div className="nr max-w-[26em] text-[1.6rem] leading-[1.4]">
                <p>The value should live in the thinking and structure of your business.</p>
                <p className="mt-3">Not inside a platform you cannot control or <em>easily leave.</em></p>
              </div>
              <p className="max-w-[30em] text-[1.02rem] leading-[1.7] text-[color:var(--ink)]/75 lg:justify-self-end">
                Your stack can change without taking your business&rsquo;s memory with it.
              </p>
            </div>
          </div>
        </section>

        <Ticker items={['Find it.', 'Codify it.', 'Put it to work.']} dark />

        {/* ── 06 · This is Envisioned ───────────────────────────────── */}
        <Rule />
        <ChapterHead n="06">How the work is done</ChapterHead>
        <section className="px-6 pt-14 pb-32 md:pb-44">
          <div className={WRAP}>
            <h2 className="nr max-w-[13em] text-balance text-[2.1rem] leading-[1.09] md:text-[3.6rem]">Find it. Codify it. Put it to work.</h2>
            <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <p className="text-[1.05rem] leading-[1.75]">We go looking across the business you have already built, not only at the polished assets.</p>
                <div className="mt-6">
                  <Sheet cols={2} items={[
                    'The recordings.', 'The client work.',
                    'The old programmes.', 'The messy documents.',
                    'The repeated questions.', 'The exceptions.', 'The decisions.',
                    'The things you say casually that turn out to explain half your method.',
                  ]} />
                </div>
                <p className="mt-8 text-[1.05rem] leading-[1.75]">We find the intelligence carrying the greatest value now, connect the patterns, extract the judgement and make the implicit thinking explicit enough to work with.</p>
                <p className="nr mt-4 text-[1.5rem] text-[color:var(--ox)]">A living source of context your business can reason from.</p>
              </div>
              <Image src="/img/city-cafe.jpg" alt="Espresso at a café table in the city" width={720} height={520} className="h-full w-full object-cover" />
            </div>

            <p className="nr mt-32 max-w-[16em] text-balance text-[2.1rem] leading-[1.15] md:mt-44 md:text-[3rem]">The point is not to document more of your business. The point is to make more of it <em>usable.</em></p>
            <div className="stagger mt-16 grid border-t-2 border-[color:var(--ink)] sm:grid-cols-3 sm:divide-x sm:divide-[color:var(--hair)]">
              <div className="py-6 sm:pr-10">
                <p className="lbl text-[color:var(--ox)]">Find it</p>
                <div className="mt-4 space-y-4 text-[1.02rem] leading-[1.7]">
                  <p>Across the offers, methods, content, client experience and systems you already have.</p>
                  <p>Including the parts nobody thought to write down, because they were obvious to you.</p>
                </div>
              </div>
              <div className="py-6 sm:px-10">
                <p className="lbl text-[color:var(--ox)]">Codify it</p>
                <div className="mt-4 space-y-4 text-[1.02rem] leading-[1.7]">
                  <p>Not another dumping ground. Not a gigantic folder called &ldquo;knowledge base&rdquo; that nobody opens.</p>
                  <p>Enough structure that the judgement itself becomes something a person or a machine can follow.</p>
                </div>
              </div>
              <div className="py-6 sm:pl-10">
                <p className="lbl text-[color:var(--ox)]">Put it to work</p>
                <div className="mt-4 space-y-4 text-[1.02rem] leading-[1.7]">
                  <p>Because beautifully organised information that still sits there doing nothing is merely a tidier form of waste.</p>
                  <p>Into a stronger client experience. Clearer decisions for your team. An interactive methodology. Reusable intellectual property. AI that finally has something meaningful to work with.</p>
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
                <p className="relative mt-10 text-[1.05rem]">Not simply what you know. How you know what to do.</p>
            <h2 className="nr relative mt-8 text-[2.8rem] leading-[1.02] md:mt-12 md:text-[5rem]">Founder Intelligence.</h2>
            <div className="mt-24 grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="space-y-4 text-[1.05rem] leading-[1.8]">
                  <p>It is the invisible architecture underneath the work.</p>
                  <p>Not the task. Not the checklist.</p>
                  <p className="nr text-[1.6rem]">The judgement that makes the result <em>good.</em></p>
                </div>
                <div className="mt-10">
                  <Ledger tight items={[
                    'How you recognise quality.',
                    'How you interpret context.',
                    'How you make trade-offs.',
                    'How you adapt your methodology.',
                    'How you know when the normal rule does not apply.',
                    'How you protect the standards that make the work yours.',
                    'How you see what other people miss.',
                  ]} />
                </div>
              </div>
              <div className="space-y-5 text-[1.05rem] leading-[1.8] lg:col-span-4 lg:col-start-9 lg:pt-32">
                <p>Documents are evidence of it.</p>
                <p>Processes are expressions of it.</p>
                <p>Content leaves traces of it.</p>
                <p>But none of them are the thing itself.</p>
                <p className="nr pt-2 text-[1.5rem] leading-[1.35] text-[color:var(--ox)]">That is the layer we are after.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 08 ────────────────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="08">When it stops coming back to you</ChapterHead>
        <section className="px-6 pt-14 pb-32 md:pb-44">
          <div className={WRAP}>
            <h2 className="nr max-w-[13em] text-balance text-[2.1rem] leading-[1.09] md:text-[3.6rem]">
              When the business can use what it knows, everything stops <em>coming back to you.</em>
            </h2>
            <div className="mt-20 grid gap-16 md:mt-28 lg:grid-cols-[1.1fr_1fr] lg:gap-0">
              <div className="lg:pr-14">
                <Ledger items={[
                  'Your clients receive more of what they actually hired you for — not simply more information, but the judgement behind it.',
                  'Your team stops having to reverse-engineer you.',
                  'Your body of work begins compounding instead of disappearing.',
                  'AI stops guessing who you are.',
                  'Your ideas stop waiting for your capacity.',
                ]} />
                <p className="nr pt-5 text-[1.6rem]"><em>And the work stops routing through you.</em></p>
              </div>
              <div className="flex flex-col justify-center space-y-5 text-[1.05rem] leading-[1.75] lg:border-l lg:border-[color:var(--hair)] lg:pl-14">
                <p>Old workshops stop being old workshops.</p>
                <p>Content stops disappearing the day after publication.</p>
                <p>Client conversations reveal patterns.</p>
                <p>Ideas begin connecting across years instead of living in separate digital boxes.</p>
                <p className="nr text-[1.7rem]">AI works with your language, standards and boundaries — <em>not the statistical average of a business like yours.</em></p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 09 · Leverage ─────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="09">Before you build anything</ChapterHead>
        <section className="px-6 pt-14 pb-32 md:pb-44">
          <div className={WRAP}>
            <h2 className="nr max-w-[15em] text-[2.2rem] leading-[1.08] md:text-[3rem]">
              Before you build anything, see what your business <em>already knows.</em>
            </h2>
            <div className="mt-20 grid gap-16 md:mt-28 lg:grid-cols-2 lg:gap-0">
              <div className="space-y-5 text-[1.05rem] leading-[1.75] lg:pr-14">
                <p>Your business does not need another collection of AI tools.</p>
                <p>
                  It needs a clear view of the intelligence it already holds, where that
                  intelligence is getting lost, and what should become usable first.
                </p>
                <p className="nr text-[2rem] text-[color:var(--ox)]">The <em>Integration Map.</em></p>
                <p>
                  A private diagnostic of the human intelligence and AI readiness inside
                  your business. You send me the raw material. I read across your offers,
                  methods, content, client experience, systems and the places where
                  everything still leads back to you.
                </p>
                <p>Then I return a written roadmap.</p>
              </div>
              <div className="lg:border-l lg:border-[color:var(--hair)] lg:pl-14">
                <div className="space-y-5 text-[1.05rem] leading-[1.75]">
                  <p className="nr text-[1.6rem] leading-[1.4]">Not another AI audit filled with tools to investigate later.</p>
                  <p className="nr text-[1.6rem] leading-[1.4]">A clear view of what you <em>already own.</em></p>
                  <p>And the most valuable place to begin.</p>
                </div>
                <div className="mt-8">
                  <Ledger tight items={[
                    'What valuable Founder Intelligence is already there.',
                    'Where it is trapped, fragmented or invisible.',
                    'Where AI is currently being forced to guess.',
                    'What should be codified first.',
                    'What could become possible once it is usable.',
                    'The right build order, without tying the plan to one platform.',
                  ]} />
                </div>
                <p className="nr mt-8 text-[1.6rem]">Start with the <em>Integration Map.</em></p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 10 ────────────────────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="10">Worthy of what is already there</ChapterHead>
        <section className="px-6 pt-14 pb-32 md:pb-44">
          <div className={WRAP}>
            <h2 className="nr max-w-[13em] text-balance text-[2.1rem] leading-[1.09] md:text-[3.6rem]">
              I am not here to make you an AI person. I am here to make AI <em>worthy of the intelligence already inside your business.</em>
            </h2>
            <div className="mt-12 max-w-[36em] space-y-6 text-[1.05rem] leading-[1.75]">
              <p>I do not want AI to help more women produce average work faster.</p>
              <p className="nr border-l-2 border-[color:var(--hair)] pl-6 text-[1.5rem]">I want it to help their hard-won intelligence become more powerful, portable and useful.</p>
              <p>I care about technology.</p>
              <p className="nr border-l-2 border-[color:var(--ox)] pl-6 text-[1.7rem] text-[color:var(--ox)]">But I care far more about what humans can do when technology extends their capacity <em>without erasing their judgement.</em></p>
            </div>
          </div>
        </section>

        {/* ── 11 · When it becomes usable ───────────────────────────── */}
        <Rule />
        <Opener n="11" kicker="What changes" title={<>Your ideas stop waiting for <em>your capacity.</em></>} />
        <section className="px-6 pt-14 pb-32 md:pb-44">
          <div className={WRAP}>
            <div className="stagger mt-10 grid gap-x-20 gap-y-24 sm:grid-cols-2">
              {[
                ['01', 'Your clients receive more of what they actually hired you for.',
                  'Not simply more information. More of the judgement behind it. More useful help when the clean example meets a very unclean reality.'],
                ['02', 'Your team stops having to reverse-engineer you.',
                  'They can access more of the context behind your decisions instead of following the process until something unusual happens and sending the whole problem back upstairs.'],
                ['03', 'Your body of work begins compounding.',
                  'Old workshops stop being old workshops. Content stops disappearing the day after publication. Client conversations reveal patterns. Ideas begin connecting across years instead of living in separate digital boxes.'],
                ['04', 'AI stops guessing who you are.',
                  'It works with your language, standards, examples, boundaries and decisions — not the statistical average of what a business like yours might say.'],
              ].map(([n, h, body], i) => (
                <div key={n} className={i % 2 === 1 ? 'sm:mt-28' : ''}>
                  <p aria-hidden="true" className="num select-none text-[5.5rem] leading-none text-[color:var(--stone)]">{n}</p>
                  <p className="nr mt-5 max-w-[16em] text-[1.55rem] leading-[1.2]">{h}</p>
                  <p className="mt-4 max-w-[30em] text-[1.02rem] leading-[1.75]">{body}</p>
                </div>
              ))}
            </div>
            <div className="mx-auto mt-32 max-w-[36em] space-y-5 text-[1.05rem] leading-[1.8]">
              <p className="fx-rv nr text-[1.9rem] leading-[1.25]">And you get to sit in the <em>director&rsquo;s chair.</em></p>
              <p>
                Your systems understand your standards, preserve your discernment, and
                carry your ideas into the world. You keep authorship. You stop being the
                only thing implementation can pass through.
              </p>
              <p>Your thinking compounds instead of circulating.</p>
              <p>
                Sometimes we go looking for one thing and find something else entirely. An
                opportunity. An offer. A method hiding inside what looked like a collection
                of unrelated decisions. A piece of intellectual property that has been
                there for years without anybody recognising what it could become.
              </p>
              <p>We do not always know what we are going to find.</p>
              <p className="nr pt-2 text-[1.5rem] text-[color:var(--ox)]"><em>That is rather the point.</em></p>
            </div>
          </div>
        </section>

        <Ticker items={['Codified in the City', 'Your intelligence. Made usable.']} dark />

        {/* ── CITC band ─────────────────────────────────────────────── */}
        <section id="citc" className="relative overflow-hidden">
          <div data-px className="relative h-[88vh] min-h-[640px] w-full overflow-hidden">
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
                <a href={CITC_HREF} className="lbl mt-8 inline-block bg-[color:var(--ox)] px-6 py-3 text-[#FBFAF9] transition-opacity hover:opacity-90">
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
            <h2 className="nr max-w-[13em] text-balance text-[2.1rem] leading-[1.09] md:text-[3.6rem]">
              Begin with the part that needs to become <em>usable first.</em>
            </h2>
            <div className="stagger mt-12 grid border-t-2 border-[color:var(--ink)] sm:grid-cols-2 lg:grid-cols-4 sm:divide-x sm:divide-[color:var(--hair)]">
              <div className="flex flex-col py-8 sm:pr-8">
                <p className="lbl text-[color:var(--ox)]">One</p>
                <p className="nr mt-4 text-[1.55rem] leading-[1.25]">Start with The Integration Map.</p>
                <p className="mt-4 flex-1 text-[1.02rem] leading-[1.7]">
                  A paid diagnostic. You send the raw material. I read
                  across your business (both the human presence and the AI legibility)
                  and return a written roadmap with the build order and the real cost
                  of staying scattered.
                </p>
                <a href={BOOK} className="lbl mt-6 text-[color:var(--ink)] transition-colors hover:text-[color:var(--ox)]">
                  Start with the Map →
                </a>
              </div>
              <div className="flex flex-col py-8 sm:px-8">
                <p className="lbl text-[color:var(--ox)]">Two</p>
                <p className="nr mt-4 text-[1.55rem] leading-[1.25]">Build it together in The Atelier.</p>
                <p className="mt-4 flex-1 text-[1.02rem] leading-[1.7]">
                  Eight weeks, live, small group. I extract your business
                  knowledge, organise it into your Pattern Book (the organised
                  brain your AI can actually work from), and build your first
                  working system on top of it. A working studio for founder
                  intelligence. Ten seats per Build, fitted in fives.
                </p>
                <a href={BOOK} className="lbl mt-6 text-[color:var(--ink)] transition-colors hover:text-[color:var(--ox)]">
                  Ask about The Atelier →
                </a>
              </div>
              <div className="flex flex-col py-8 sm:pr-8 lg:px-8">
                <p className="lbl text-[color:var(--ox)]">Three</p>
                <p className="nr mt-4 text-[1.55rem] leading-[1.25]">Already building? Stay for The Residency.</p>
                <p className="mt-4 flex-1 text-[1.02rem] leading-[1.7]">
                  Ninety days as your integration partner after a build day. One
                  live sprint per month plus async access. Because the interesting thing
                  about making one part of the business more intelligent is that you
                  start noticing all the other places where the same thinking could
                  travel.
                </p>
                <a href={BOOK} className="lbl mt-6 text-[color:var(--ink)] transition-colors hover:text-[color:var(--ox)]">
                  Ask about The Residency →
                </a>
              </div>
              <div className="flex flex-col py-8 sm:pl-8">
                <p className="lbl text-[color:var(--ox)]">Four</p>
                <p className="nr mt-4 text-[1.55rem] leading-[1.25]">For the businesses ready to go deeper: Embedded Genius.</p>
                <p className="mt-4 flex-1 text-[1.02rem] leading-[1.7]">
                  Your methodology deployed as AI tools inside your own programme.
                  So your genius scales inside the client experience without you
                  being in every room. For selected founder-led businesses, by
                  enquiry only.
                </p>
                <a href={BOOK} className="lbl mt-6 text-[color:var(--ink)] transition-colors hover:text-[color:var(--ox)]">
                  Enquire about Embedded Genius →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Free tools ────────────────────────────────────────────── */}
        <div className={`${WRAP} px-6 py-10`}>
          <div className="flex flex-col gap-4 border-t border-[color:var(--hair)] pt-8 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="lbl text-[color:var(--ox)]">Before you commit to anything</p>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-[1.02rem]">
              <a href="https://taste.envisioned.me" className="transition-colors hover:text-[color:var(--ox)]">
                Take the Codification Interview (free) →
              </a>
              <a href="/resources" className="transition-colors hover:text-[color:var(--ox)]">
                Download a skill file →
              </a>
            </div>
          </div>
        </div>

        {/* ── Probably for you ──────────────────────────────────────── */}
        <Rule />
        <ChapterHead n="13">What you already own</ChapterHead>
        <section className="px-6 pt-14 pb-32 md:pb-44">
          <div className={WRAP}>
            <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
              <div>
                <h2 className="nr text-[2.2rem] leading-[1.08] md:text-[3rem]">
                  Your business has already paid for this intelligence.
                </h2>
                <p className="nr mt-10 text-[1.7rem]">In years. In experiments. In mistakes. In clients. In decisions. In work.</p>
                <p className="nr text-[1.7rem] text-[color:var(--ox)]"><em>It should not stay trapped in your head.</em></p>
              </div>
              <Ledger items={[
                'Scattered across your digital history.',
                'Flattened into generic output by a machine that cannot yet see it.',
                'Waiting inside a masterclass, a call recording, a methodology that evolved so gradually you stopped noticing it.',
                'Held in the judgement your team keeps bringing back to you.',
                'Earned once, and paid for many times over.',
                'And still not carried by the business that depends on it.',
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
              <p>And I am fairly obsessed with the intelligence people do not realise they have.</p>
              <p>
                My career has moved through international development, photography, brand
                strategy, founder-led businesses and AI. Different industries. Same question:
              </p>
              <p className="nr text-[1.5rem] leading-[1.4]">
                What do people know that the systems around them <em>fail to capture?</em>
              </p>
              <p>
                I am a visual thinker, a pattern spotter, a strategist and a builder. I am
                also the person who will stop you halfway through a sentence because the
                thing you just said casually is probably more valuable than the polished
                answer you prepared.
              </p>
              <p>I care about technology.</p>
              <p>
                But I care far more about what humans can do when technology extends their
                capacity without erasing their judgement.
              </p>
              <p>I do not want AI to help more women produce average work faster.</p>
              <div className="pt-2">
                <Ledger tight items={[
                  'I want it to help their hard-won intelligence become more powerful.',
                  'More portable.',
                  'More useful.',
                  'I am not here to make you an AI person.',
                  'I am here to make AI worthy of the intelligence already inside your business.',
                ]} />
              </div>
              <p className="nr pt-3 text-[1.5rem] text-[color:var(--ox)]">That is the future I am interested in.</p>
            </div>
          </div>
        </section>

        {/* ── Closing ───────────────────────────────────────────────── */}
        <Rule />
        <section className="px-6 pt-16 pb-8">
          <div className={WRAP}>
            <div className="max-w-[38em] space-y-5 text-[1.05rem] leading-[1.75]">
              <p className="nr text-[1.7rem] leading-[1.35]">
                It should not remain trapped in your head, scattered across your digital
                history, or flattened into generic output by a machine that cannot yet see it.
              </p>
              <p className="nr text-[1.7rem] leading-[1.35]">
                Let&rsquo;s find it. Codify it. And <em>put it to work.</em>
              </p>
            </div>
          </div>
        </section>

        <Ticker items={['Find it.', 'Codify it.', 'Put it to work.']} />

        <section className="dk bg-[color:var(--char)] px-6 py-24 text-[#FBFAF9]">
          <div className={WRAP}>
            <p className="nr text-[1.4rem] text-[#FBFAF9]/80">Before you build anything&hellip;</p>
            <h2 className="nr mt-3 max-w-[14em] text-[2.6rem] leading-[1.08] md:text-[3.8rem]">
              See what your business <em>already knows.</em>
            </h2>
            <p className="mt-8 max-w-[30em] text-[1.1rem] leading-[1.7] text-[#FBFAF9]/85">
              A private diagnostic of the human intelligence and AI readiness inside your
              business, and the most valuable place to begin.
            </p>
            <a href={BOOK} className="lbl mt-10 inline-block bg-[color:var(--ox)] px-7 py-3.5 text-[#FBFAF9] transition-opacity hover:opacity-90">
              Start with the Integration Map ↗
            </a>
            <div className="mt-20 flex flex-col gap-3 border-t border-[#FBFAF9]/20 pt-8 md:flex-row md:items-baseline md:justify-between">
              <div>
                <p className="nr text-[1.3rem]">Envisioned</p>
                <p className="lbl mt-1 text-[#FBFAF9]/60">Founder intelligence, made usable.</p>
              </div>
              <div className="lbl flex flex-wrap gap-x-8 gap-y-2 text-[#FBFAF9]/70">
                {[
                  ['01', 'About', '/#about'],
                  ['02', 'Work Together', '/#ways-to-work'],
                  ['03', 'Articles', '/blog'],
                  ['04', 'Resources', '/resources'],
                  ['05', 'Codified in the City', '/#citc'],
                ].map(([n, label, href]) => (
                  <a key={label} href={href} className="flex items-baseline gap-2 hover:text-[#FBFAF9]">
                    <span className="text-[0.6rem] text-[#FBFAF9]/40">{n}</span>{label}
                  </a>
                ))}
                <a href="mailto:hello@mariaines.co" className="hover:text-[#FBFAF9]">hello@mariaines.co</a>
                <a href="https://app.envisioned.me/login" title="Studio login" className="hover:text-[#FBFAF9]">Studio</a>
              </div>
            </div>
            <p className="lbl mt-8 text-[#FBFAF9]/40">© 2026 Envisioned · Written, built and run from Europe.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
