import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Inter, Courier_Prime } from 'next/font/google';
import PageTracker from '@/components/analytics/PageTracker';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import SiteSchema from '@/components/seo/SiteSchema';
import './globals.css';

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
});

const courierPrime = Courier_Prime({
  variable: '--font-kicker',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  // metadataBase + a relative canonical makes every route declare itself as the
  // canonical URL. The site answers on two hostnames (www and home), so without
  // this, search engines saw identical content twice with nothing saying which
  // one wins — split authority and possible duplicate-content treatment.
  // Audit finding, 2026-08-27.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.envisioned.me'),
  alternates: { canonical: './' },
  title: 'Envisioned | Founder Intelligence, Made Usable',
  description:
    'Envisioned turns the judgement, methods and intellectual property inside founder-led businesses into platform-agnostic systems your team, clients and AI can actually use.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${courierPrime.variable} antialiased`}>
        <SiteSchema />
        {/* Analytics. Suspense because useSearchParams opts the tree into
            client rendering otherwise — the tracker must never affect how the
            page itself is served. */}
        <Suspense fallback={null}>
          <PageTracker />
        </Suspense>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
