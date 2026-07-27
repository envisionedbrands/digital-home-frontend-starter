import type { Metadata } from 'next';

const COMMUNITY_URL = 'https://www.skool.com/bravebrand/about';

export const metadata: Metadata = {
  title: 'Contact — Envisioned Systems',
  description: 'The one or two honest ways to reach us.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen px-6 pt-40 pb-32 flex flex-col justify-center">
      <div className="max-w-[900px] mx-auto w-full">
        <p className="kicker mb-8">Contact</p>

        <h1 className="display text-4xl md:text-6xl xl:text-7xl text-ink mb-8">
          This page needs
          <br />
          your contact paths.
        </h1>

        <p className="text-xl text-ink-soft max-w-[38em] leading-[1.75] mb-20">
          The Contact page works best when it removes ambiguity. Add the one or
          two paths you actually want people to use, then remove anything that
          creates hesitation.
        </p>

        <div className="grid gap-px sm:grid-cols-3 mb-20 border border-hair bg-hair">
          {[
            ['Email', 'Your main inbox for direct, low-friction conversations.'],
            ['Booking', 'A Cal.com or scheduling link if calls are the conversion step.'],
            ['Community', 'A newsletter, group, or community where the relationship continues.'],
          ].map(([label, note]) => (
            <div key={label} className="bg-canvas-soft px-8 py-9">
              <span className="kicker block mb-5">{label}</span>
              <p className="text-[1.05rem] text-taupe leading-[1.7]">{note}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-hair-olive pt-10">
          <p className="text-[1.05rem] text-taupe leading-[1.7]">
            Need help with your contact flow?{' '}
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
