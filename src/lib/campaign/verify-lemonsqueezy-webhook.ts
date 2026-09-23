/**
 * Lemon Squeezy webhook signature verification.
 *
 * LS signs the raw request body with HMAC-SHA256 using the secret set at
 * webhook creation, sent hex-encoded in the X-Signature header. Verification
 * must run on the raw body text, before any JSON.parse — re-serializing and
 * re-signing the parsed object will not match.
 */

function hexToBytes(hex: string): Uint8Array | null {
  if (!/^[0-9a-fA-F]+$/.test(hex) || hex.length % 2 !== 0) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

export async function verifyLemonSqueezyWebhookSignature(input: {
  secret: string;
  rawBody: string;
  signatureHeader: string | null;
}): Promise<boolean> {
  const { secret, rawBody, signatureHeader } = input;
  if (!signatureHeader) return false;

  const signatureBytes = hexToBytes(signatureHeader.trim());
  if (!signatureBytes) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    toArrayBuffer(new TextEncoder().encode(secret)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  return crypto.subtle.verify(
    "HMAC",
    key,
    toArrayBuffer(signatureBytes),
    toArrayBuffer(new TextEncoder().encode(rawBody))
  );
}
