import type { Metadata } from 'next';
import ResourceCard from './ResourceCard';

export const metadata: Metadata = {
  title: 'Resources — Envisioned Systems',
  description:
    'Free tools and skill files from Envisioned. Drop them into your AI and put your intelligence to work.',
};

const RESOURCES = [
  {
    title: 'Call Intelligence',
    description:
      'Turn every meeting into actions, content seeds, and follow-ups. Drop this into Claude and point it at your next call transcript.',
    filename: 'call-intelligence-skill.md',
    image: '/img/carousel/not-behind.jpg',
    gradientFallback:
      'linear-gradient(135deg, #B87A5D 0%, #8A7A68 50%, #4C5A2E 100%)',
  },
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen px-6 pt-40 pb-32 flex flex-col justify-center">
      <div className="max-w-[1000px] mx-auto w-full">
        <p className="kicker mb-8">Resources</p>

        <h1 className="display text-4xl md:text-6xl xl:text-7xl text-ink mb-8">
          Free tools and skill files
          <br />
          from Envisioned
        </h1>

        <p className="text-xl text-ink-soft max-w-[38em] leading-[1.75] mb-20">
          Skill files are structured instructions you hand to your AI. They
          carry your standards into conversations you&rsquo;re not typing in.
          Download, drop in, point at real work.
        </p>

        {/* Card grid — 2 columns on md+, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {RESOURCES.map((resource) => (
            <ResourceCard key={resource.filename} resource={resource} />
          ))}
        </div>

        <div className="border-t border-hair-olive pt-10 mt-20">
          <p className="text-[1.05rem] text-taupe leading-[1.7] max-w-[40em]">
            More skill files are coming. If you want the architecture behind
            them, that&rsquo;s what we build together.
          </p>
        </div>
      </div>
    </main>
  );
}
