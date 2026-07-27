import Link from 'next/link';

const COMMUNITY_URL = 'https://www.skool.com/bravebrand/about';

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 pt-40 pb-32 flex flex-col justify-center">
      <div className="max-w-[1140px] mx-auto w-full">
        <p className="kicker mb-8">Envisioned Systems · Your digital home</p>

        <h1 className="display text-5xl md:text-7xl xl:text-[6.5rem] text-ink mb-10">
          Your foundation
          <br />
          is ready.
        </h1>

        <p className="text-xl md:text-[1.55rem] text-ink-soft max-w-[38em] leading-[1.75] mb-24">
          The database, the publishing pipeline, and the quiet machinery of an
          owned presence are already wired. Your voice, your pages, your pace —
          that is what makes it yours.
        </p>

        <div className="grid gap-px sm:grid-cols-3 mb-28 border border-hair bg-hair">
          <div className="bg-canvas-soft px-8 py-10">
            <span className="kicker block mb-6">Already running</span>
            <h3 className="text-[1.55rem] font-medium text-ink mb-3">
              Database &amp; API
            </h3>
            <p className="text-[1.05rem] text-taupe leading-[1.7]">
              Supabase schema, API routes, auth, middleware, and visitor tracking.
            </p>
          </div>

          <div className="bg-canvas-soft px-8 py-10">
            <span className="kicker block mb-6">Already running</span>
            <h3 className="text-[1.55rem] font-medium text-ink mb-3">
              Publishing pipeline
            </h3>
            <p className="text-[1.05rem] text-taupe leading-[1.7]">
              Content calendar, AI writing in your voice, a daily publishing rhythm.
            </p>
          </div>

          <div className="bg-canvas-soft px-8 py-10">
            <span className="kicker block mb-6">Already running</span>
            <h3 className="text-[1.55rem] font-medium text-ink mb-3">
              SEO &amp; schema
            </h3>
            <p className="text-[1.05rem] text-taupe leading-[1.7]">
              JSON-LD, llms.txt, robots.txt, structured data from your entities table.
            </p>
          </div>
        </div>

        <div className="border-t border-hair-olive pt-14">
          <p className="kicker mb-10">Your next steps</p>

          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <h3 className="text-[1.35rem] font-medium text-ink mb-3">
                1. Seed your corpus
              </h3>
              <p className="text-[1.05rem] text-taupe leading-[1.7] mb-4">
                Fill the content corpus with your voice, positioning, and proof —
                it is what separates writing that sounds like you from writing
                that sounds like everyone.
              </p>
              <a
                href={COMMUNITY_URL}
                target="_blank"
                rel="noreferrer"
                className="text-[1.02rem] italic text-olive hover:text-olive-deep transition-colors"
              >
                Guidance in the community &rarr;
              </a>
            </div>

            <div>
              <h3 className="text-[1.35rem] font-medium text-ink mb-3">
                2. Shape your pages
              </h3>
              <p className="text-[1.05rem] text-taupe leading-[1.7] mb-4">
                The container is winter; the imagery is autumn. Bring your own
                photography and let the whitespace do the luxury work.
              </p>
              <Link
                href="/about"
                className="text-[1.02rem] italic text-olive hover:text-olive-deep transition-colors"
              >
                Start with the story &rarr;
              </Link>
            </div>

            <div>
              <h3 className="text-[1.35rem] font-medium text-ink mb-3">
                3. Deploy to your own ground
              </h3>
              <p className="text-[1.05rem] text-taupe leading-[1.7] mb-4">
                Build and deploy to infrastructure you own. No rented rooms.
              </p>
              <Link
                href="/blog"
                className="text-[1.02rem] italic text-olive hover:text-olive-deep transition-colors"
              >
                See the journal &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
