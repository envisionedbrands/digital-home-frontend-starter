'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FOOTER_GROUPS } from '@/lib/nav';

/**
 * Grouped footer. Columns share one baseline grid, so the group titles align
 * across the row and each column's links stack under its own heading instead
 * of one flat list wrapping wherever the line happened to run out.
 *
 * Link data lives in FOOTER_GROUPS (src/lib/nav.ts) so this and the homepage's
 * own dark footer band cannot disagree about what the site contains.
 */
export default function Footer() {
  // Hidden on the homepage — it ends in its own Chronicle-style footer band.
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <footer className="border-t border-hair px-6 py-14 mt-8">
      <div className="max-w-[1140px] mx-auto">
        <div className="grid gap-12 md:grid-cols-[0.7fr_3.3fr] md:gap-14">
          <div>
            <p className="display text-[1.35rem] text-ink">Envisioned</p>
            <p className="kicker mt-3 text-[0.74rem] text-olive">
              Founder intelligence, made usable.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {FOOTER_GROUPS.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <p className="kicker text-[0.68rem] text-olive">{group.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      {item.href.startsWith('http') ? (
                        <a
                          href={item.href}
                          className="text-[0.95rem] text-taupe hover:text-ink transition-colors"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className="text-[0.95rem] text-taupe hover:text-ink transition-colors"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <p className="kicker mt-14 border-t border-hair pt-8 text-[0.74rem] text-ink/80">
          © 2026 Envisioned · Written, built and run from Europe.
        </p>
      </div>
    </footer>
  );
}
