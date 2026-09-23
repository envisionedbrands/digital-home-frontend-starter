/**
 * Lemon Squeezy license validation for the /team protected routes.
 *
 * The License API (activate/validate/deactivate) is public and needs no API
 * key — it's meant to be called with just the customer's own key. That's the
 * entire point: a paying customer's receipt is the credential, not a site
 * login.
 */

const VALIDATE_URL = "https://api.lemonsqueezy.com/v1/licenses/validate";

export type LicenseValidation =
  | { valid: true; productId: number; disabled: boolean }
  | { valid: false; error: string };

export async function validateLicenseKey(licenseKey: string): Promise<LicenseValidation> {
  let response: Response;
  try {
    response = await fetch(VALIDATE_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ license_key: licenseKey }).toString(),
    });
  } catch {
    return { valid: false, error: "Could not reach the license check. Try again in a moment." };
  }

  let data: {
    valid?: boolean;
    error?: string | null;
    license_key?: { status?: string };
    meta?: { product_id?: number };
  };
  try {
    data = await response.json();
  } catch {
    return { valid: false, error: "License check returned an unreadable response." };
  }

  if (!data.valid) {
    return { valid: false, error: data.error || "Invalid license key" };
  }

  const productId = data.meta?.product_id;
  if (typeof productId !== "number") {
    return { valid: false, error: "License key did not resolve to a product." };
  }

  return { valid: true, productId, disabled: data.license_key?.status === "disabled" };
}
