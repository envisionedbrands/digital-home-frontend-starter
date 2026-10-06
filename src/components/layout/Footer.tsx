'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
  // Hidden on the homepage — it ends in its own Chronicle-style footer band.
  // Also hidden on /team-coppola and /coppola — both ship their own header
  // and footer and are not meant to nest inside the main site chrome. Same
  // for /open-studio (2026-09-30): a four-column footer full of links is
  // another exit on a page that exists to do one thing.
  const pathname = usePathname();
  if (
    pathname === '/' ||
    pathname.startsWith('/team-coppola') ||
    pathname.startsWith('/coppola') ||
    pathname.startsWith('/open-studio')
  )
    return null;

  return (
    <footer className="border-t border-hair px-6 py-14 mt-8">
      <div className="max-w-[1140px] mx-auto text-center">
        <p className="display text-[1.35rem] text-ink">Envisioned</p>
        <p className="kicker mt-3 text-[0.74rem] text-olive">
          Founder intelligence, made usable.
        </p>

        <p className="kicker mt-14 border-t border-hair pt-8 text-[0.74rem] text-ink/80">
          © 2026 Envisioned · Written, built and run from Europe.
        </p>
      </div>
    </footer>
  );
}
