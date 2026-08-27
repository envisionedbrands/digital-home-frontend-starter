import type { Metadata } from 'next';
import FounderAccessDiagnostic from './FounderAccessDiagnostic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://home.envisioned.me';

/**
 * The public name is "The Founder Intelligence Assessment"; the identifier is
 * `founder-access` — the route, the API namespace, the CRM source, the tags
 * and migration 201's custom fields all use it. Renaming the URL would break
 * the join between a completion row and the lead it belongs to, for nothing.
 */
export const metadata: Metadata = {
  title: 'The Founder Intelligence Assessment | Envisioned',
  description:
    'Thirteen questions that place your business on five layers between instinct and infrastructure, name the one constraint holding transfer back, and give you the next move.',
  alternates: { canonical: `${SITE_URL}/founder-access` },
  openGraph: {
    title: 'How much of your business still depends on you?',
    description:
      'A four-minute assessment for founders whose method works, but only when they are in the room.',
    url: `${SITE_URL}/founder-access`,
    type: 'website',
    images: [{
      url: `${SITE_URL}/founder-access-social.png`,
      width: 1672,
      height: 941,
      alt: 'A notebook connected to a structured sequence of decision cards',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How much of your business still depends on you?',
    description:
      'A four-minute assessment for founders whose method works, but only when they are in the room.',
    images: [`${SITE_URL}/founder-access-social.png`],
  },
};

export default function FounderAccessPage() {
  return <FounderAccessDiagnostic />;
}
