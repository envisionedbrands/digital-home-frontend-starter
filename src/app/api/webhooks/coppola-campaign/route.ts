/**
 * POST /api/webhooks/coppola-campaign
 *
 * Lemon Squeezy order_created webhook, scoped to counting founding-price
 * Coppola sales for the Open Studio campaign's live seat counter.
 *
 * Deliberately does not call back to the Lemon Squeezy management API to
 * confirm anything — that key has no read-only variant, and this endpoint
 * exists specifically so a public-facing counter never needs it. A forged
 * event here can only push the counter wrong; it cannot read or change
 * anything in the store. See src/lib/campaign/coppola-open-studio.ts.
 */

import { NextRequest } from "next/server";
import { verifyLemonSqueezyWebhookSignature } from "@/lib/campaign/verify-lemonsqueezy-webhook";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { jsonResponse, errorResponse } from "@/lib/api/response";

const COPPOLA_PRODUCT_ID = 1241346;
const FOUNDING_PRICE_CENTS = 29700; // €297.00 — only the locked/COPPOLA checkout lands here
const KV_KEY = "coppola-open-studio:founding-redemptions";

type KVNamespace = {
  get: (key: string) => Promise<string | null>;
  put: (key: string, value: string) => Promise<void>;
};

async function getCampaignKV(): Promise<KVNamespace | undefined> {
  let env: Record<string, KVNamespace | undefined> | undefined;
  try {
    env = getCloudflareContext().env as unknown as Record<string, KVNamespace | undefined>;
  } catch {
    // Some request contexts only expose the async accessor.
    env = (await getCloudflareContext({ async: true })).env as unknown as Record<
      string,
      KVNamespace | undefined
    >;
  }
  return env?.CAMPAIGN_STATE;
}

export async function POST(request: NextRequest) {
  const secret = process.env.COPPOLA_CAMPAIGN_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[coppola-campaign webhook] COPPOLA_CAMPAIGN_WEBHOOK_SECRET not set");
    return errorResponse("Not configured", 500);
  }

  const rawBody = await request.text();
  const valid = await verifyLemonSqueezyWebhookSignature({
    secret,
    rawBody,
    signatureHeader: request.headers.get("x-signature"),
  });
  if (!valid) {
    return errorResponse("Invalid signature", 401);
  }

  let payload: {
    meta?: { event_name?: string };
    data?: {
      attributes?: {
        total?: number;
        first_order_item?: { product_id?: number };
        status?: string;
      };
    };
  };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return errorResponse("Invalid JSON", 400);
  }

  if (payload.meta?.event_name !== "order_created") {
    // Subscribed to order_created only, but confirm rather than assume.
    return jsonResponse({ ignored: true, reason: "not order_created" });
  }

  const attrs = payload.data?.attributes;
  const isCoppolaFoundingOrder =
    attrs?.status === "paid" &&
    attrs?.first_order_item?.product_id === COPPOLA_PRODUCT_ID &&
    attrs?.total === FOUNDING_PRICE_CENTS;

  if (!isCoppolaFoundingOrder) {
    return jsonResponse({ ignored: true, reason: "not a founding-price Coppola order" });
  }

  const kv = await getCampaignKV();
  if (!kv) {
    console.error("[coppola-campaign webhook] CAMPAIGN_STATE KV binding unavailable");
    return errorResponse("Storage unavailable", 500);
  }

  const current = Number((await kv.get(KV_KEY)) ?? "0");
  const next = (Number.isFinite(current) ? current : 0) + 1;
  await kv.put(KV_KEY, String(next));

  return jsonResponse({ recorded: true, foundingRedemptions: next });
}
