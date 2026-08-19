/**
 * Rate limiting for the public write endpoints.
 *
 * These routes accept anonymous POSTs and write to the database, so without a
 * limit anyone can fill the calendar with fake bookings, flood the CRM with junk
 * leads, or burn the Supabase egress allowance. Cloudflare's rate limiter runs
 * at the edge, costs nothing, and needs no KV or Durable Object.
 *
 * Fails OPEN on purpose: if the binding is missing (local dev, preview) the
 * request proceeds. A rate limiter that takes the site down when it breaks is
 * worse than the abuse it prevents.
 *
 * Audit finding, 2026-08-18.
 */

import { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type Limiter = { limit: (opts: { key: string }) => Promise<{ success: boolean }> };

export type LimiterName = "WRITE_LIMITER" | "STRICT_LIMITER";

/** The caller's IP, as Cloudflare sees it. */
function clientKey(request: NextRequest, bucket: string): string {
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  return `${bucket}:${ip}`;
}

/**
 * Returns a 429 Response when the caller is over the limit, or null to proceed.
 */
export async function checkRateLimit(
  request: NextRequest,
  name: LimiterName
): Promise<Response | null> {
  try {
    let env: Record<string, Limiter | undefined> | undefined;
    try {
      env = getCloudflareContext().env as unknown as Record<string, Limiter | undefined>;
    } catch {
      // Some request contexts only expose the async accessor.
      env = (await getCloudflareContext({ async: true }))
        .env as unknown as Record<string, Limiter | undefined>;
    }

    const limiter = env?.[name];
    if (!limiter?.limit) {
      // Fail open, but never silently: a limiter that quietly does nothing is
      // worse than none, because it reads as protection that isn't there.
      console.warn(`[rate-limit] binding ${name} unavailable — request allowed through`);
      return null;
    }

    const { success } = await limiter.limit({ key: clientKey(request, name) });
    if (success) return null;

    return Response.json(
      { error: "Too many requests. Slow down and try again shortly." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  } catch (e) {
    console.warn(`[rate-limit] ${name} threw, allowing request:`, e instanceof Error ? e.message : e);
    return null; // never let the limiter itself break the endpoint
  }
}
