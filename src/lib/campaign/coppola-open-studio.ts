/**
 * Single source of truth for the Coppola Open Studio campaign's checkout
 * destination and founding-seat count.
 *
 * Every campaign asset (prep email, landing page, DM scripts) must point at
 * a page that reads CURRENT_CHECKOUT_URL, never at a raw checkout link
 * pasted directly into copy. A sent email is immutable; this constant is
 * not — switching from the founding link to the fallback is a one-line
 * edit here, not a recall of everything already sent.
 *
 * The seat count is written by the webhook at
 * src/app/api/webhooks/coppola-campaign/route.ts and read here from KV —
 * never fetched live from the Lemon Squeezy management API. That key has no
 * scoped/read-only variant (confirmed against the docs, 2026-09-23), so
 * calling it from a public-facing Worker would give a cosmetic counter the
 * same blast radius as full store access: refunds, discount deletion, every
 * customer record. Flagged by Priya (Offer Strategist), agreed.
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";

// Locked checkout: COPPOLA pre-applied (€497 -> €297), discount box hidden.
// Switch to the fallback below the moment the founding ten sell out.
export const CURRENT_CHECKOUT_URL =
  "https://shop.envisioned.me/checkout/custom/c081f229-a685-462e-9d27-0e7c491d6763?signature=feb37fec66d3146ab447002923bf14e748f2fb88aa8a7a2f589ba41c3acb3e45";

// Fallback: plain €497, no discount code baked in, no discount box to
// exploit. Built and verified by Ledger 2026-09-23. Swap CURRENT_CHECKOUT_URL
// to this the moment getFoundingSeatsLeft() reaches 0 — the eleventh buyer
// pays full price and attends the same session, nobody is turned away.
export const FALLBACK_CHECKOUT_URL =
  "https://shop.envisioned.me/checkout/custom/9b1178b0-c4bc-4fa8-bbff-bd1006e09477?signature=4d22176291f810fc4e438a9c66d8dce2d6ba0c8ad768a2c757b059a28922b252";

export const FOUNDING_SEATS_CAP = 10;

const KV_KEY = "coppola-open-studio:founding-redemptions";

type KVNamespace = {
  get: (key: string) => Promise<string | null>;
};

export type SeatsStatus =
  | { known: true; seatsLeft: number }
  | { known: false };

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

/**
 * Reads the founding-seat count from KV. Returns known: false if the
 * binding is missing or the value hasn't been written yet — the page must
 * treat an unknown count as "don't claim a number", never as zero or full.
 */
export async function getFoundingSeatsLeft(): Promise<SeatsStatus> {
  let kv: KVNamespace | undefined;
  try {
    kv = await getCampaignKV();
  } catch {
    return { known: false };
  }
  if (!kv) return { known: false };

  const raw = await kv.get(KV_KEY);
  if (raw === null) return { known: false };

  const redeemed = Number(raw);
  if (!Number.isFinite(redeemed)) return { known: false };

  return { known: true, seatsLeft: Math.max(0, FOUNDING_SEATS_CAP - redeemed) };
}
