/**
 * Public booking endpoint — no auth, this is the front door.
 *
 * GET  /api/book/:slug          → openings (ISO starts, owner's timezone)
 * POST /api/book/:slug          → take a slot
 *
 * The slot is re-validated server-side against the live engine before the
 * write, so a stale page or a double-submit can't book a gone slot.
 */
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getEventType, getOpenings } from "@/lib/booking/query";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, ctx: Ctx) {
  const { slug } = await ctx.params;
  const eventType = await getEventType(slug);
  if (!eventType) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const days = Math.min(60, Math.max(1, Number(request.nextUrl.searchParams.get("days") || 28)));
  const { slots, timeZone } = await getOpenings(eventType, days);

  return NextResponse.json({
    event_type: {
      slug: eventType.slug,
      name: eventType.name,
      description: eventType.description,
      duration_minutes: eventType.duration_minutes,
      location_kind: eventType.location_kind,
      price_cents: eventType.price_cents,
      currency: eventType.currency,
    },
    timezone: timeZone,
    slots,
  });
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(request: NextRequest, ctx: Ctx) {
  const { slug } = await ctx.params;
  const eventType = await getEventType(slug);
  if (!eventType) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: {
    starts_at?: string;
    name?: string;
    email?: string;
    notes?: string;
    timezone?: string;
    recording_consent?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const startsAt = (body.starts_at || "").trim();
  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();

  if (!startsAt || !name || !isEmail(email)) {
    return NextResponse.json(
      { error: "Name, a valid email and a time are required." },
      { status: 400 }
    );
  }

  // Re-check against the live engine — never trust the client's slot.
  const { slots, timeZone } = await getOpenings(eventType, 60);
  const target = new Date(startsAt).getTime();
  if (!slots.some((s) => new Date(s).getTime() === target)) {
    return NextResponse.json(
      { error: "That time has just been taken. Pick another and we'll hold it." },
      { status: 409 }
    );
  }

  const supabase = createAdminClient();

  // Lead first: a booking is a person, and the CRM is the source of truth.
  const { data: existing } = await supabase
    .from("leads")
    .select("id, tags")
    .eq("email", email)
    .maybeSingle();

  const [firstName, ...rest] = name.split(" ");
  const tag = `booked-${eventType.slug}`;
  let leadId = existing?.id;

  if (leadId) {
    const tags = Array.from(new Set([...(existing?.tags || []), "booked-call", tag]));
    await supabase
      .from("leads")
      .update({ tags, last_activity_at: new Date().toISOString() })
      .eq("id", leadId);
  } else {
    const { data: created, error } = await supabase
      .from("leads")
      .insert({
        email,
        first_name: firstName || null,
        last_name: rest.join(" ") || null,
        source: "booking",
        tags: ["booked-call", tag],
      })
      .select("id")
      .single();
    if (error) return NextResponse.json({ error: "Could not save your details." }, { status: 500 });
    leadId = created.id;
  }

  const endsAt = new Date(target + eventType.duration_minutes * 60000).toISOString();
  const bookingToken = crypto.randomUUID();

  const { data: appt, error: apptError } = await supabase
    .from("appointments")
    .insert({
      lead_id: leadId,
      event_type_id: eventType.id,
      title: `${eventType.name} — ${name}`,
      starts_at: new Date(target).toISOString(),
      ends_at: endsAt,
      status: "scheduled",
      source: "native",
      timezone: timeZone,
      guest_timezone: body.timezone || null,
      guest_notes: body.notes || null,
      booking_token: bookingToken,
      meeting_url: eventType.meeting_url,
    })
    .select("id")
    .single();

  if (apptError) {
    // Unique-violation on the token is the only realistic race here.
    return NextResponse.json({ error: "Could not hold that time." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    appointment_id: appt.id,
    booking_token: bookingToken,
    starts_at: new Date(target).toISOString(),
    timezone: timeZone,
    // Confirmation + reminder emails are a separate build (docs/booking-sequence.md).
    confirmation_note: eventType.confirmation_note,
  });
}
