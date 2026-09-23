import type { Metadata } from 'next';
import Script from 'next/script';
import { TEAM_PAGE_MARKUP } from './markup';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.envisioned.me';

export const metadata: Metadata = {
  title: 'Your team · Envision OS',
  description:
    'Meet your Envision OS AI assistants. Hire them into Buzz and let them guide your first task.',
  alternates: { canonical: `${SITE_URL}/team-coppola` },
  icons: { icon: '/team-coppola/favicon.svg' },
  robots: { index: false, follow: false },
};

export default function TeamPage() {
  return (
    <>
      <link rel="stylesheet" href="/team-coppola/style.css" />
      <div dangerouslySetInnerHTML={{ __html: TEAM_PAGE_MARKUP }} />
      <Script src="/team-coppola/app.js" strategy="afterInteractive" />
    </>
  );
}
