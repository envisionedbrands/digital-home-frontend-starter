/**
 * POST /api/assets — Upload an image asset to the public `images` storage bucket.
 *
 * Machine-auth only (x-api-key + HMAC signature). Used by the local push
 * bridge to host article images on our own storage instead of hotlinking
 * external CDNs.
 *
 * Body: { filename: string, content_type: string, content_base64: string }
 * Returns: { url } — the public URL of the stored object.
 */

import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { authenticateRequest, unauthorizedResponse } from "@/lib/api/auth";
import { jsonResponse, errorResponse } from "@/lib/api/response";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth.authenticated) return unauthorizedResponse(auth.error);
  if (auth.mode !== "api-key") return errorResponse("Machine auth required", 403);

  const body = await request.json();
  const { filename, content_type: contentType, content_base64: contentBase64 } = body || {};
  if (!filename || !contentType || !contentBase64) {
    return errorResponse("filename, content_type and content_base64 are required");
  }
  if (!ALLOWED_TYPES.includes(contentType)) {
    return errorResponse(`content_type must be one of: ${ALLOWED_TYPES.join(", ")}`);
  }

  let bytes: Uint8Array;
  try {
    const binary = atob(contentBase64);
    bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  } catch {
    return errorResponse("content_base64 is not valid base64");
  }
  if (bytes.length > MAX_BYTES) {
    return errorResponse(`File too large (${bytes.length} bytes; max ${MAX_BYTES})`);
  }

  // Safe object path: articles/<sanitized-name>
  const safeName = filename.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  const path = `articles/${safeName}`;

  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from("images")
    .upload(path, bytes, { contentType, upsert: true });

  if (error) return errorResponse(`Upload failed: ${error.message}`, 500);

  const { data } = supabase.storage.from("images").getPublicUrl(path);
  return jsonResponse({ url: data.publicUrl }, 201);
}
