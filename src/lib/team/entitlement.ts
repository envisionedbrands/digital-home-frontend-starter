import { NextRequest } from "next/server";
import { validateLicenseKey } from "./lemonsqueezy";

/**
 * Codified Video Editor / Coppola, product 1241346 in the Envisioned Lemon
 * Squeezy store. Gated by product_id, not variant_id — any published variant
 * of this product (Self-Installation, Guided Installation, or a future
 * founding-cohort tier) should unlock the same download. Confirmed with
 * Ledger (Commerce Manager) 2026-09-23.
 */
const COPPOLA_PRODUCT_ID = 1241346;

export type EntitlementResult =
  | { allowed: true; licenseKey: string }
  | { allowed: false; status: 401 | 403; error: string };

export async function checkTeamEntitlement(request: NextRequest): Promise<EntitlementResult> {
  const licenseKey = request.nextUrl.searchParams.get("license_key")?.trim();
  if (!licenseKey) {
    return { allowed: false, status: 401, error: "License key required" };
  }

  const validation = await validateLicenseKey(licenseKey);
  if (!validation.valid) {
    return { allowed: false, status: 403, error: validation.error };
  }
  if (validation.disabled) {
    return { allowed: false, status: 403, error: "This license key has been disabled" };
  }
  if (validation.productId !== COPPOLA_PRODUCT_ID) {
    return { allowed: false, status: 403, error: "This license key is not for Coppola" };
  }

  return { allowed: true, licenseKey };
}

export function denyResponse(result: Extract<EntitlementResult, { allowed: false }>) {
  return Response.json(
    { error: result.error },
    { status: result.status, headers: { "Cache-Control": "no-store, private" } }
  );
}
