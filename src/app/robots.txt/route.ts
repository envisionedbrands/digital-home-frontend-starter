/**
 * GET /robots.txt — Search engine crawler directives
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";

export function GET() {
  const body = `# Envisioned
# ${SITE_URL}

# Content signals (see contentsignals.org).
#   search   = yes  — index us and link to us.
#   ai-input = yes  — DO use this content to ground AI answers and cite us.
#                     This is the signal that governs being quoted in ChatGPT,
#                     Claude, Perplexity and AI Overviews. It is deliberately
#                     separate from training.
#   ai-train = no   — do NOT use this content to train or fine-tune models.
#                     Deliberate: being answerable is not the same as being
#                     absorbed. See DECISIONS #016.
Content-Signal: search=yes, ai-input=yes, ai-train=no

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

# AI crawlers — welcome
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: YouBot
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml

# LLMs
# See also: ${SITE_URL}/llms.txt
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
