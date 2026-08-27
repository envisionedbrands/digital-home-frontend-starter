/**
 * Site-wide JSON-LD.
 *
 * The site had NO structured data on any page (audited 2026-08-27), which meant
 * search engines and LLMs had to infer from prose who Maria-Ines is, what
 * Envisioned is, and whether the two are the same entity. They are the thing
 * that makes scattered mentions resolve to ONE findable entity, which is the
 * prerequisite for being cited in AI answers.
 *
 * Naming follows DECISIONS #015 exactly: the person is "Maria-Ines" (no
 * accent), the business is "Envisioned", the legal entity is
 * "Maria-Ines Design Studio" declared via legalName + alternateName, and
 * envisionedbrands appears ONLY as the Instagram profile URL.
 */

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://home.envisioned.me';

const PERSON = {
  '@type': 'Person',
  '@id': `${SITE}/#maria-ines`,
  name: 'Maria-Ines',
  givenName: 'Maria-Ines',
  jobTitle: 'AI Systems Builder',
  description:
    'Builds AI infrastructure for established founders — extracting the judgement, standards and methodology a founder already has, and turning it into systems the business runs on. Former international development programme lead across 30+ countries; photographer before that.',
  url: SITE,
  email: 'hello@mariaines.co',
  nationality: { '@type': 'Country', name: 'Venezuela' },
  knowsAbout: [
    'Founder intelligence',
    'AI systems for founder-led businesses',
    'Codifying expertise and methodology',
    'Knowledge transfer and delegation',
    'AI voice and tone modelling',
    'Business process automation',
  ],
  sameAs: ['https://www.instagram.com/envisionedbrands/'],
  worksFor: { '@id': `${SITE}/#envisioned` },
};

const ORG = {
  '@type': 'ProfessionalService',
  '@id': `${SITE}/#envisioned`,
  name: 'Envisioned',
  legalName: 'Maria-Ines Design Studio',
  alternateName: 'Maria-Ines Design Studio, trading as Envisioned',
  url: SITE,
  email: 'hello@mariaines.co',
  founder: { '@id': `${SITE}/#maria-ines` },
  description:
    'Envisioned builds AI infrastructure that runs on a founder’s own judgement, language and methodology — so their expertise works in client delivery, team decisions and AI systems without the founder in every room.',
  areaServed: 'Worldwide',
  slogan: 'Your intelligence. Made usable.',
  sameAs: ['https://www.instagram.com/envisionedbrands/'],
};

const WEBSITE = {
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: SITE,
  name: 'Envisioned',
  publisher: { '@id': `${SITE}/#envisioned` },
  inLanguage: 'en',
};

export default function SiteSchema() {
  const graph = { '@context': 'https://schema.org', '@graph': [PERSON, ORG, WEBSITE] };
  return (
    <script
      type="application/ld+json"
      // Static, author-controlled object — no user input reaches this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
