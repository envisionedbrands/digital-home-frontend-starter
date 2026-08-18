/**
 * GET /api/leads — List leads (auth required)
 * POST /api/leads — Capture a new lead (email opt-in)
 *
 * This is the PII boundary — before this endpoint is called,
 * the visitor is fully anonymous. After, we have their email.
 */

import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { authenticateRequest, unauthorizedResponse } from "@/lib/api/auth";
import { jsonResponse, errorResponse, parsePagination, paginatedResponse } from "@/lib/api/response";
import { VISITOR_COOKIE_NAME } from "@/lib/personalization/visitor";
import type { Enums } from "@/types/database";

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth.authenticated) return unauthorizedResponse(auth.error);

  const { searchParams } = request.nextUrl;
  const { page, limit, offset } = parsePagination(searchParams);

  const supabase = createAdminClient();
  let query = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  const status = searchParams.get("status");
  if (status) query = query.eq("status", status as Enums<"lead_status">);

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) return errorResponse(error.message, 500);

  return paginatedResponse(data || [], count || 0, page, limit);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.email) {
    return errorResponse("email is required");
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return errorResponse("Invalid email format");
  }

  const visitorId = request.cookies.get(VISITOR_COOKIE_NAME)?.value || null;

  const supabase = createAdminClient();

  // Check if lead already exists
  const { data: existing } = await supabase
    .from("leads")
    .select("id")
    .eq("email", body.email.toLowerCase())
    .single();

  if (existing) {
    // Only send the fields that were actually supplied. Every value here used to
    // be `|| undefined`, so a repeat capture carrying just an email produced an
    // EMPTY update — PostgREST then matched no rows and `.single()` failed with
    // "Cannot coerce the result to a single JSON object". Anyone who submitted a
    // form twice got an error instead of a thank-you. Audit finding, 2026-08-18.
    const updates: Record<string, unknown> = {};
    if (body.first_name) updates.first_name = body.first_name;
    if (body.last_name) updates.last_name = body.last_name;
    if (visitorId) updates.visitor_id = visitorId;
    if (body.capture_page) updates.capture_page = body.capture_page;
    if (body.tags) updates.tags = body.tags;

    if (Object.keys(updates).length === 0) {
      return jsonResponse({ ok: true, id: existing.id });
    }

    const { data, error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", existing.id)
      .select("id")
      .single();

    if (error) return errorResponse(error.message, 500);
    // Never echo the stored row back. This endpoint is PUBLIC and writes with
    // the service-role key, so returning the full record handed any anonymous
    // caller the whole CRM row for any email they could guess — name, tags,
    // score, status, unsubscribe_token — and doubled as an oracle for "is this
    // person on her list?". Audit finding, 2026-08-18.
    return jsonResponse({ ok: true, id: data.id });
  }

  // Create new lead
  const { data, error } = await supabase
    .from("leads")
    .insert({
      email: body.email.toLowerCase(),
      first_name: body.first_name || null,
      last_name: body.last_name || null,
      visitor_id: visitorId,
      source: body.source || null,
      capture_page: body.capture_page || null,
      status: "new",
      score: 0,
      tags: body.tags || [],
      interested_offers: body.interested_offers || [],
    })
    .select("id")
    .single();

  if (error) return errorResponse(error.message, 500);

  // Link visitor to lead
  if (visitorId) {
    await supabase
      .from("visitors")
      .update({ lead_id: data.id })
      .eq("anonymous_id", visitorId);
  }

  return jsonResponse({ ok: true, id: data.id }, 201);
}
