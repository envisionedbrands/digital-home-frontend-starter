import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Inter, Courier_Prime } from 'next/font/google';
import PageTracker from '@/components/analytics/PageTracker';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
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
  title: 'Envisioned Brands | Turn Founder Intelligence Into Working Business Systems',
  description:
    'Maria-Ines helps established founders get their voice, judgement and methodology out of their heads and working across client delivery, team decisions and AI systems.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${courierPrime.variable} antialiased`}>
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
