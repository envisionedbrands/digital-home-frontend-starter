'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const FOOTER_LINKS = [
  { href: '/founder-access', label: 'Founder Access Diagnostic' },
  { href: 'https://codifiedinthecity.com', label: 'Codified in the City' },
  { href: 'https://codifiedinthecity.com', label: 'Codified Live' },
  { href: '/contact', label: 'The Integration Map' },
  { href: '/contact', label: 'The Atelier' },
  { href: '/contact', label: 'Codified Studio' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Notes' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  // Hidden on the homepage — it ends in its own Chronicle-style footer band.
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <footer className="border-t border-hair px-6 py-14 mt-8">
      <div className="max-w-[1140px] mx-auto">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="display text-[1.35rem] text-ink">Envisioned</p>
            <p className="kicker mt-3 text-[0.74rem] text-olive">
              Founder intelligence, made usable.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-14 gap-y-3 sm:grid-cols-3">
            {FOOTER_LINKS.map((link) =>
              link.href.startsWith('http') ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[0.95rem] text-taupe hover:text-ink transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[0.95rem] text-taupe hover:text-ink transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>

        <p className="kicker mt-12 text-[0.74rem] text-ink/80">
          © 2026 Envisioned. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
