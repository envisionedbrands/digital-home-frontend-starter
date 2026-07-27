import type { Metadata } from 'next';

const COMMUNITY_URL = 'https://www.skool.com/bravebrand/about';

export const metadata: Metadata = {
  title: 'About — Envisioned Systems',
  description: 'The story, beliefs, and proof behind Envisioned Systems.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 pt-40 pb-32 flex flex-col justify-center">
      <div className="max-w-[900px] mx-auto w-full">
        <p className="kicker mb-8">About</p>

        <h1 className="display text-4xl md:text-6xl xl:text-7xl text-ink mb-8">
          This page needs
          <br />
          your story.
        </h1>

        <p className="text-xl text-ink-soft max-w-[38em] leading-[1.75] mb-20">
          The About page is one of the strongest trust-builders on the site.
          Replace this with the origin, perspective, and proof that only your
          brand can tell.
        </p>

        <div className="grid gap-px sm:grid-cols-2 mb-20 border border-hair bg-hair">
          {[
            ['Origin', 'The story behind the work and what pulled you into it.'],
            ['Beliefs', 'The ideas you want people to associate with your brand.'],
            ['Team', 'The people behind the work and why they matter.'],
            ['Proof', 'Results, credentials, or testimonials that make the story credible.'],
          ].map(([label, note]) => (
            <div key={label} className="bg-canvas-soft px-8 py-9">
              <span className="kicker block mb-5">{label}</span>
              <p className="text-[1.05rem] text-taupe leading-[1.7]">{note}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-hair-olive pt-10">
          <p className="text-[1.05rem] text-taupe leading-[1.7]">
            Need help shaping your brand story?{' '}
            <a
              href={COMMUNITY_URL}
              target="_blank"
              rel="noreferrer"
              className="italic text-olive hover:text-olive-deep transition-colors"
            >
              Guidance in the community &rarr;
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
