import type { Metadata } from 'next';

const COMMUNITY_URL = 'https://www.skool.com/bravebrand/about';

export const metadata: Metadata = {
  title: 'Services — Envisioned Systems',
  description: 'Offers, outcomes, and the next honest step.',
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen px-6 pt-40 pb-32 flex flex-col justify-center">
      <div className="max-w-[900px] mx-auto w-full">
        <p className="kicker mb-8">Services</p>

        <h1 className="display text-4xl md:text-6xl xl:text-7xl text-ink mb-8">
          This page needs
          <br />
          your offers.
        </h1>

        <p className="text-xl text-ink-soft max-w-[38em] leading-[1.75] mb-20">
          The Services page is where visitors decide if you can help them.
          Replace this with your actual offers, outcomes, pricing, and a clear
          next step.
        </p>

        <div className="grid gap-px sm:grid-cols-3 mb-20 border border-hair bg-hair">
          {[
            ['Flagship offer', 'The main service or transformation you lead with.'],
            ['Entry point', 'A lighter engagement for people who are not ready for the full thing.'],
            ['Ongoing support', 'The retained relationship or next step after the first win.'],
          ].map(([label, note]) => (
            <div key={label} className="bg-canvas-soft px-8 py-9">
              <span className="kicker block mb-5">{label}</span>
              <p className="text-[1.05rem] text-taupe leading-[1.7]">{note}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-hair-olive pt-10">
          <p className="text-[1.05rem] text-taupe leading-[1.7]">
            Need help structuring your offers?{' '}
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
