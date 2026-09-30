/**
 * POST /api/webhooks/coppola-campaign
 *
 * Lemon Squeezy order_created webhook for the Open Studio campaign. Two
 * separate jobs on the same event:
 *
 * 1. Count founding-price sales for the live seat counter (original job,
 *    2026-09-23). Deliberately does not call back to the Lemon Squeezy
 *    management API to confirm anything — that key has no read-only
 *    variant, and this endpoint exists specifically so a public-facing
 *    counter never needs it. A forged event here can only push the counter
 *    wrong; it cannot read or change anything in the store. See
 *    src/lib/campaign/coppola-open-studio.ts.
 * 2. Capture the buyer as a CRM lead and enroll them in the booking
 *    confirmation email (2026-09-30, Simon — the gap Carrie's prep copy
 *    exposed: nothing was sending that email or creating a lead on
 *    purchase before this). Runs for ANY paid Coppola order, founding or
 *    full-price, via the same signed request the safe-ai and Interview App
 *    integrations already use — see src/lib/crm/backend.ts.
 *    No license key is needed here: the confirmation copy only ever says
 *    "your licence key is in your receipt" (Lemon Squeezy's own receipt
 *    email), so `order_created` alone is enough (confirmed with Carrie,
 *    2026-09-30 — no need to also subscribe `license_key_created`).
 */

import { NextRequest } from "next/server";
import { verifyLemonSqueezyWebhookSignature } from "@/lib/campaign/verify-lemonsqueezy-webhook";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { jsonResponse, errorResponse } from "@/lib/api/response";
import { signedCrmPost } from "@/lib/crm/backend";

const COPPOLA_PRODUCT_ID = 1241346;
const FOUNDING_PRICE_CENTS = 29700; // €297.00 — only the locked/COPPOLA checkout lands here
const KV_KEY = "coppola-open-studio:founding-redemptions";
// draft until MI answers Decision 2 (time/format) and the workflow's
// [[TIME + FORMAT]] placeholder is filled in — see PLANS/COPPOLA_EVERGREEN_SWITCH_CHECKLIST.md.
// The capture endpoint only enrolls into an *active* workflow, so leaving
// this as a draft is what keeps the confirmation email from firing early.
const BOOKING_CONFIRMATION_WORKFLOW_ID = "06eeed63-a856-40bb-b380-02b8a7ee2dee";

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
      id?: string;
      attributes?: {
        total?: number;
        first_order_item?: { product_id?: number };
        status?: string;
        user_email?: string;
        user_name?: string;
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
  const isPaidCoppolaOrder =
    attrs?.status === "paid" && attrs?.first_order_item?.product_id === COPPOLA_PRODUCT_ID;

  if (!isPaidCoppolaOrder) {
    return jsonResponse({ ignored: true, reason: "not a paid Coppola order" });
  }

  const isFounding = attrs?.total === FOUNDING_PRICE_CENTS;
  let foundingRedemptions: number | undefined;

  if (isFounding) {
    const kv = await getCampaignKV();
    if (!kv) {
      // The counter is a nice-to-have on top of a real sale — never let a
      // missing binding stop the lead capture below.
      console.error("[coppola-campaign webhook] CAMPAIGN_STATE KV binding unavailable");
    } else {
      const current = Number((await kv.get(KV_KEY)) ?? "0");
      foundingRedemptions = (Number.isFinite(current) ? current : 0) + 1;
      await kv.put(KV_KEY, String(foundingRedemptions));
    }
  }

  let leadCaptured = false;
  const email = attrs?.user_email?.trim();
  if (email) {
    try {
      const res = await signedCrmPost("/api/crm/capture", {
        email,
        ...(attrs?.user_name ? { name: attrs.user_name } : {}),
        source: "coppola-open-studio",
        page: "/open-studio",
        form: "coppola-open-studio-purchase",
        tags: [
          "coppola-open-studio-buyer",
          isFounding ? "coppola-open-studio-founding" : "coppola-open-studio-evergreen",
        ],
        custom: {
          order_id: payload.data?.id ?? "",
          order_total_cents: String(attrs?.total ?? ""),
        },
        workflow_id: BOOKING_CONFIRMATION_WORKFLOW_ID,
      });
      leadCaptured = res.ok;
      if (!res.ok) {
        console.error(
          "[coppola-campaign webhook] CRM capture failed",
          res.status,
          (await res.text().catch(() => "")).slice(0, 300)
        );
      }
    } catch (e) {
      console.error("[coppola-campaign webhook] CRM capture error", e);
    }
  } else {
    console.error("[coppola-campaign webhook] order_created had no user_email");
  }

  return jsonResponse({ recorded: true, foundingRedemptions, leadCaptured });
}
