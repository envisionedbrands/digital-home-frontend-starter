import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ — Envisioned',
  description:
    'What Envisioned does, who it serves, and how to work with Maria-Ines. AI infrastructure for founder-led businesses.',
};

/* ── FAQ data ──
   Structured so it renders on the page AND as FAQPage JSON-LD.
   LLMs, agents, and search engines parse both. */
const FAQS: { q: string; a: string }[] = [
  {
    q: 'What does Envisioned do?',
    a: 'Envisioned codifies founder intelligence into AI infrastructure. We extract methodology, judgment, and standards from founder-led businesses and structure them into systems that humans, teams, and AI can use. Not coaching. Not consulting. Infrastructure.',
  },
  {
    q: 'Who is Maria-Ines?',
    a: 'Venezuelan-born, Netherlands-based brand strategist and AI infrastructure builder. 20+ years in international development. Founder of Envisioned. She builds AI-powered systems that carry founder standards into rooms the founder is not in.',
  },
  {
    q: 'What is Codified in the City?',
    a: 'A private VIP day for established founders. In-person in the Netherlands (or by request in other locations when the client covers travel) or virtual via Codified Live, a full day over Zoom with remote screen control. \u20ac5,500. One founder, one day: extraction, codification, and deployment of the first priority application.',
  },
  {
    q: 'What is The Atelier?',
    a: 'An eight-week live group program, capped at 10 and fitted in groups of five. Business knowledge is extracted into a Pattern Book and the first working system is built. \u20ac2,499. A working studio for founder intelligence.',
  },
  {
    q: 'What is The Integration Map?',
    a: 'A \u20ac1,500 async presence audit. No call required. A 10-minute voice-note intake, then a full audit of how legible the business is to both human and AI readers, plus a written build order. Credits toward Codified in the City within 60 days.',
  },
  {
    q: 'Where is Envisioned based?',
    a: 'The Netherlands. Maria-Ines Design Studio, trading as Envisioned. In-person work is always available in the Netherlands, and in other locations by request. Vienna is a featured October 2026 location aligned with TEDAI Vienna.',
  },
  {
    q: 'Does Envisioned use AI?',
    a: 'Yes, extensively. AI handles research, drafting, scheduling, data analysis, and client system builds. Strategy, architecture, and all final decisions stay human. Full policy at /ai-transparency.',
  },
  {
    q: 'How does Envisioned handle client data?',
    a: 'Client data is processed through AI to build their infrastructure. Never shared across clients, never used in marketing without permission, never uploaded to training datasets. The codified intelligence belongs to the founder.',
  },
  {
    q: 'Can I book a virtual session instead of in-person?',
    a: 'Yes. Codified Live is the virtual version of Codified in the City. Same methodology, same price (\u20ac5,500), full day over Zoom with remote screen control.',
  },
  {
    q: 'What is the AI crawler policy?',
    a: 'Envisioned content is discoverable and citable by AI answer engines (retrieval with attribution). It is not available for model training. Technical policy: search=yes, ai-input=yes, ai-train=no.',
  },
];

/* JSON-LD: FAQPage schema for LLMs and search */
function FaqSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function FAQPage() {
  return (
    <>
      <FaqSchema />
      <main className="min-h-screen px-6 pt-40 pb-32 flex flex-col justify-center">
        <div className="max-w-[900px] mx-auto w-full">
          <p className="kicker mb-8">FAQ</p>

          <h1 className="display text-4xl md:text-6xl xl:text-7xl text-ink mb-8">
            Questions people actually ask.
          </h1>

          <p className="max-w-[40em] text-[1.15rem] text-ink-soft leading-[1.8] mb-20">
            Straight answers. No &ldquo;it depends&rdquo; where a number
            belongs.
          </p>

          <div className="space-y-0">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="group border-t border-hair-olive"
              >
                <summary className="flex items-start gap-4 py-7 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="kicker text-[0.74rem] text-olive mt-1.5 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[1.12rem] text-ink font-medium leading-[1.5] group-open:text-olive-deep transition-colors">
                    {faq.q}
                  </span>
                  <span className="ml-auto text-taupe text-xl shrink-0 mt-0.5 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="pl-10 pb-8 pr-8">
                  <p className="text-[1.05rem] text-taupe leading-[1.75] max-w-[40em]">
                    {faq.q === 'Does Envisioned use AI?' ? (
                      <>
                        Yes, extensively. AI handles research, drafting,
                        scheduling, data analysis, and client system builds.
                        Strategy, architecture, and all final decisions stay
                        human. Full policy at{' '}
                        <Link
                          href="/ai-transparency"
                          className="italic text-olive hover:text-olive-deep transition-colors"
                        >
                          /ai-transparency
                        </Link>
                        .
                      </>
                    ) : (
                      faq.a
                    )}
                  </p>
                </div>
              </details>
            ))}
            <div className="border-t border-hair-olive" />
          </div>

          {/* ── Footer link ── */}
          <div className="pt-14">
            <p className="kicker mb-6">Still have questions?</p>
            <Link
              href="/contact"
              className="text-[1.02rem] italic text-olive hover:text-olive-deep transition-colors"
            >
              Get in touch &rarr;
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
