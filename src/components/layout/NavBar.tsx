'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  // The homepage carries its own Chronicle-style masthead (src/app/page.tsx);
  // rendering this bar too would stack two navs. /team-coppola ships its own header
  // from the approved handoff page for the same reason. /coppola (the Video
  // Editing Menu, 2026-09-29) is the same case: a verbatim extraction of an
  // approved artifact with its own <h1> and footer. /open-studio (2026-09-30,
  // Chandler's structural review) is fed entirely by DM/email/ads for one
  // paid CTA — the marketing nav is five competing exits above the fold on a
  // page that should have exactly one way forward.
  const isHome =
    pathname === '/' ||
    pathname.startsWith('/team-coppola') ||
    pathname.startsWith('/coppola') ||
    pathname.startsWith('/open-studio');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isHome) return null;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 px-6 transition-all duration-300 ${
        scrolled ? 'bg-canvas/95 backdrop-blur-sm border-b border-hair' : ''
      }`}
    >
      <div className="max-w-[1140px] mx-auto flex items-center justify-between h-[84px]">
        {/* Plain anchor on purpose: the homepage is served by a different Worker
            (founder-intelligence-home), so the logo must do a full page load,
            not a client-side route to this app's own "/" page. */}
        <a href="https://www.envisioned.me/" className="flex items-baseline gap-3 text-ink">
          <span className="display text-[1.45rem] tracking-[0.02em]">
            Envisioned
          </span>
        </a>
      </div>
    </nav>
  );
}
