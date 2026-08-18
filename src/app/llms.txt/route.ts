/**
 * GET /llms.txt — Machine-readable site summary for LLMs
 * See: https://llmstxt.org/
 */

import { createAdminClient } from "@/lib/supabase/server";
import { generateLlmsTxt } from "@/lib/schema/llms-txt";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const supabase = createAdminClient();

  const [
    { data: entities },
    { data: content },
    { data: offers },
  ] = await Promise.all([
    // Select only the columns generateLlmsTxt actually reads. `select("*")`
    // pulled the FULL BODY of every published article on every request just to
    // print a title, slug and excerpt — a payload that grows with the archive
    // and is then thrown away. Audit finding, 2026-08-18.
    supabase.from("entities").select("name, description, entity_type, url").order("name"),
    supabase
      .from("content_objects")
      .select("title, slug, excerpt, subtitle, status")
      .eq("status", "published")
      .order("published_at", { ascending: false }),
    supabase
      .from("offers")
      .select("name, description, tagline, price_display, cta_url, who_its_for, status")
      .eq("status", "active")
      .order("position_in_ladder"),
  ]);

  const txt = generateLlmsTxt(
    entities || [],
    content || [],
    offers || []
  );

  return new Response(txt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
