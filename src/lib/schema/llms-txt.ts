/**
 * llms.txt Generator
 * Generates the llms.txt file that tells LLMs how to understand this site.
 * See: https://llmstxt.org/
 *
 * Pulls from entities, content objects, and offers to build a complete picture.
 */

import type { Tables } from "@/types/database";

// Only the columns this generator reads. Narrowed from the full Row types so
// callers can select just these — llms.txt used to `select("*")` and pull every
// article's full body on every request to print a title. Audit, 2026-08-18.
type Entity = Pick<Tables<"entities">, "name" | "description" | "entity_type" | "url">;
type ContentObject = Pick<Tables<"content_objects">, "title" | "slug" | "excerpt" | "subtitle" | "status">;
type Offer = Pick<
  Tables<"offers">,
  "name" | "description" | "tagline" | "price_display" | "cta_url" | "who_its_for" | "status"
>;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "[YOUR BRAND]";

/**
 * Generate the full llms.txt content.
 */
export function generateLlmsTxt(
  entities: Entity[],
  content: ContentObject[],
  offers: Offer[]
): string {
  const lines: string[] = [];

  lines.push(`# ${SITE_NAME}`);
  lines.push("");
  lines.push(
    "> Envisioned Systems builds AI infrastructure that codifies founder intelligence — turning how an expert founder thinks, decides, and works into systems their business runs on."
  );
  lines.push("");

  lines.push("## About");
  lines.push("");
  lines.push(
    "Envisioned Systems is run by Maria-Inés, who spent twenty years running multi-million-dollar programs across thirty countries before building AI systems for founders. " +
      "The work is not coaching and not generic automation: it is extracting the judgment, patterns, and standards a founder already has, and building AI infrastructure around them — " +
      "so the business keeps thinking in the founder's voice even when the founder is not in the room. Clients are experienced founders and consultants whose expertise is proven but scattered across files, calls, and inboxes."
  );
  lines.push("");

  // Key entities (dynamic from database)
  const people = entities.filter((e) => e.entity_type === "person");
  const orgs = entities.filter((e) => e.entity_type === "organization");

  if (orgs.length > 0 || people.length > 0) {
    lines.push("## Key People & Organizations");
    lines.push("");
    for (const entity of [...orgs, ...people]) {
      lines.push(`- **${entity.name}** (${entity.entity_type}): ${entity.description || ""}`);
      if (entity.url) lines.push(`  URL: ${entity.url}`);
    }
    lines.push("");
  }

  // Services (dynamic from database)
  if (offers.length > 0) {
    lines.push("## Services & Offers");
    lines.push("");
    for (const offer of offers) {
      lines.push(`- **${offer.name}**: ${offer.tagline || offer.description || ""}`);
      if (offer.price_display) lines.push(`  Price: ${offer.price_display}`);
      if (offer.who_its_for) lines.push(`  For: ${offer.who_its_for}`);
      if (offer.cta_url) lines.push(`  URL: ${offer.cta_url.startsWith("/") ? SITE_URL + offer.cta_url : offer.cta_url}`);
    }
    lines.push("");
  }

  // Content (dynamic from database)
  const published = content.filter((c) => c.status === "published");
  if (published.length > 0) {
    lines.push("## Content");
    lines.push("");
    for (const item of published) {
      const url = `${SITE_URL}/blog/${item.slug}`;
      lines.push(`- [${item.title}](${url}): ${item.excerpt || item.subtitle || ""}`);
    }
    lines.push("");
  }

  // API info for agents
  lines.push("## API");
  lines.push("");
  lines.push("This site provides a REST API for programmatic access:");
  lines.push("");
  lines.push(`- Content: GET ${SITE_URL}/api/content`);
  lines.push(`- Offers: GET ${SITE_URL}/api/offers`);
  lines.push(`- Analytics: POST ${SITE_URL}/api/analytics`);
  lines.push("");
  lines.push("Administrative and agent-only routes require session auth or x-api-key access.");
  lines.push("");

  // Contact
  lines.push("## Contact");
  lines.push("");
  lines.push(`- Website: ${SITE_URL}`);
  lines.push("");

  return lines.join("\n");
}
