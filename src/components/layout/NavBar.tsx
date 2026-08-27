'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NAV_ITEMS, STUDIO, PRIMARY_CTA } from '@/lib/nav';

const NAV_LINKS = NAV_ITEMS.map((i) => ({ href: i.href, label: i.label }));

export default function NavBar() {
  const pathname = usePathname();

  // The homepage carries its own Chronicle-style masthead (src/app/page.tsx);
  // rendering this bar too would stack two navs.
  const isHome = pathname === '/';
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
        <Link href="/" className="flex items-baseline gap-3 text-ink">
          <span className="display text-[1.45rem] tracking-[0.02em]">
            Envisioned
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) =>
            link.href.startsWith('http') ? (
              <a
                key={link.href}
                href={link.href}
                className="text-[1rem] text-taupe hover:text-ink transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[1rem] transition-colors ${
                  !link.href.includes('#') && pathname.startsWith(link.href)
                    ? 'text-ink border-b border-olive'
                    : 'text-taupe hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            )
          )}
          <a
            href={STUDIO.href}
            className="text-[0.85rem] text-taupe hover:text-ink transition-colors tracking-[0.04em]"
            title="Studio login"
          >
            {STUDIO.label}
          </a>
          <a
            href={PRIMARY_CTA.href}
            className="whitespace-nowrap text-[0.95rem] bg-olive text-canvas px-7 py-2.5 hover:bg-olive-deep transition-colors tracking-[0.04em]"
          >
            {PRIMARY_CTA.label}
          </a>
        </div>
      </div>
    </nav>
  );
}
