import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact — Envisioned Systems',
  description: 'Write to Maria-Inés, begin with the Integration Map, or read the essays first.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen px-6 pt-40 pb-32 flex flex-col justify-center">
      <div className="max-w-[900px] mx-auto w-full">
        <p className="kicker mb-8">The door</p>

        <h1 className="display text-4xl md:text-6xl xl:text-7xl text-ink mb-8">
          No funnels here.
          <br />
          Just a door.
        </h1>

        <p className="text-xl text-ink-soft max-w-[38em] leading-[1.75] mb-20">
          The Integration Map is open any day of the year; start there and the
          map tells us both what&rsquo;s true. Or don&rsquo;t decide anything
          yet. The people who eventually sit at my table usually read for months
          first. I count on it.
        </p>

        <div className="grid gap-px sm:grid-cols-3 mb-20 border border-hair bg-hair">
          <div className="bg-canvas-soft px-8 py-9">
            <span className="kicker block mb-5">Write to me</span>
            <p className="text-[1.05rem] text-taupe leading-[1.7] mb-4">
              One inbox, read by me. Tell me what your Tuesday actually looks
              like.
            </p>
            <a
              href="mailto:hello@mariaines.co"
              className="text-[1.02rem] italic text-olive hover:text-olive-deep transition-colors"
            >
              hello@mariaines.co &rarr;
            </a>
          </div>
          <div className="bg-canvas-soft px-8 py-9">
            <span className="kicker block mb-5">Begin the reading</span>
            <p className="text-[1.05rem] text-taupe leading-[1.7] mb-4">
              The Integration Map: a 10-minute voice note from you, a written
              build order back.
            </p>
            <Link
              href="/services"
              className="text-[1.02rem] italic text-olive hover:text-olive-deep transition-colors"
            >
              See the rooms &rarr;
            </Link>
          </div>
          <div className="bg-canvas-soft px-8 py-9">
            <span className="kicker block mb-5">Read first</span>
            <p className="text-[1.05rem] text-taupe leading-[1.7] mb-4">
              The essays are free. Philosophy stays free; the architecture is
              what we build together.
            </p>
            <Link
              href="/blog"
              className="text-[1.02rem] italic text-olive hover:text-olive-deep transition-colors"
            >
              The journal &rarr;
            </Link>
          </div>
        </div>

        <div className="border-t border-hair-olive pt-10">
          <p className="text-[1.05rem] text-taupe leading-[1.7]">
            No countdowns, no urgency theater. The cap and the calendar do that
            work.
          </p>
        </div>
      </div>
    </main>
  );
}
