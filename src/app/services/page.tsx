import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'The Rooms — Envisioned',
  description:
    'One method, five fittings: extraction, codification, deployment. The Integration Map, the Atelier, Codified in the City, the Residency, and Embedded Genius.',
};

const ROOMS: Array<{
  name: string;
  price: string;
  kind: string;
  body: string;
  tuesday: string;
}> = [
  {
    name: 'The Integration Map',
    price: '€1,500 · open any day',
    kind: 'The reading',
    body:
      'A 10-minute voice note from you. A full audit of how legible your business is to both readers (humans and machines), and a written build order. On your desk within days.',
    tuesday: 'Tuesday: you stop guessing what to build first; the map says.',
  },
  {
    name: 'The Atelier',
    price: 'Admitted · details on application',
    kind: 'The group fitting',
    body:
      'Live, capped, fitted in small rooms. Eight weeks, six fittings. You leave with your pattern codified and the spec for your first tool.',
    tuesday: 'Tuesday: your clients stop stalling between calls, without needing more of you.',
  },
  {
    name: 'Codified in the City / Codified Live',
    price: '€5,500 · admitted',
    kind: 'The private fitting',
    body:
      'One day, one founder. Paris, Milan, Amsterdam (or the same day over Zoom, my hands on your screen). Morning install. The long lunch while it runs. Afternoon: the 12-month roadmap.',
    tuesday: 'Tuesday: you watch your business answer in your voice before dessert.',
  },
  {
    name: 'The Residency',
    price: '€1,250/month × 3',
    kind: 'The alterations',
    body:
      'Ninety days of adoption after the build. Monthly sprint, async access. Sold only at the end of a build day.',
    tuesday: 'Tuesday: the system survives contact with your real week.',
  },
  {
    name: 'Embedded Genius',
    price: '€12,000',
    kind: 'The commission',
    body:
      'Your methodology, deployed as AI tools inside your own program, for your clients&rsquo; hands.',
    tuesday: 'Tuesday: your standards teach when you&rsquo;re not on the call.',
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen px-6 pt-40 pb-32 flex flex-col justify-center">
      <div className="max-w-[1000px] mx-auto w-full">
        <p className="kicker mb-8">The rooms</p>

        <h1 className="display text-4xl md:text-6xl xl:text-7xl text-ink mb-8">
          One method.
          <br />
          Five fittings.
        </h1>

        <p className="text-xl text-ink-soft max-w-[38em] leading-[1.75] mb-20">
          Every room below runs on the same spine: extraction, codification,
          deployment. They differ in how close you want me in the room.
        </p>

        <div className="flex flex-col gap-px border border-hair bg-hair mb-16">
          {ROOMS.map((room) => (
            <div key={room.name} className="bg-canvas-soft px-8 py-10">
              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
                <h2 className="text-[1.55rem] font-medium text-ink">{room.name}</h2>
                <span className="kicker">{room.price}</span>
              </div>
              <span className="kicker block mb-4 text-olive">{room.kind}</span>
              <p
                className="text-[1.08rem] text-taupe leading-[1.75] mb-4"
                dangerouslySetInnerHTML={{ __html: room.body }}
              />
              <p
                className="text-[1.02rem] italic text-ink-soft leading-[1.7]"
                dangerouslySetInnerHTML={{ __html: room.tuesday }}
              />
            </div>
          ))}
        </div>

        <div className="border-t border-hair-olive pt-10">
          <p className="text-[1.08rem] text-taupe leading-[1.75] max-w-[40em] mb-6">
            The rooms are admitted, not sold. Applications, three questions, a
            twenty-minute conversation. No countdowns; the cap and the calendar
            do that work.
          </p>
          <Link
            href="/contact"
            className="text-[1.02rem] italic text-olive hover:text-olive-deep transition-colors"
          >
            Begin the reading &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
