/**
 * Shared reads for the public booking pages.
 *
 * Booking is native (MI 2026-08-15 — off GHL, off Cal.com). The supply side
 * lives in booking_event_types / booking_availability / booking_blackouts;
 * the diary lives in `appointments`. Slot maths is in ./slots.
 */
import { createAdminClient } from "@/lib/supabase/server";
import { generateSlots, type AvailabilityRule, type EventType } from "./slots";

export const DEFAULT_TZ = "Europe/Amsterdam";

export type PublicEventType = EventType & {
  description: string | null;
  price_cents: number;
  currency: string;
  location_kind: string;
  confirmation_note: string | null;
  meeting_url: string | null;
  is_public: boolean;
};

export async function getOwnerTimezone(): Promise<string> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("backend_settings")
    .select("value")
    .eq("key", "booking_timezone")
    .maybeSingle();
  return typeof data?.value === "string" ? data.value : DEFAULT_TZ;
}

export async function getEventType(slug: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("booking_event_types")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  return data as PublicEventType | null;
}

/**
 * Openings for an event type. Everything already in the diary blocks
 * everything else — a booked hour is a booked hour regardless of which
 * calendar it came through.
 */
export async function getOpenings(
  eventType: PublicEventType,
  days = 28
): Promise<{ slots: string[]; timeZone: string }> {
  const supabase = createAdminClient();
  const timeZone = await getOwnerTimezone();

  const [{ data: availability }, { data: busy }, { data: blackouts }] = await Promise.all([
    supabase.from("booking_availability").select("*").eq("event_type_id", eventType.id),
    supabase
      .from("appointments")
      .select("starts_at, ends_at")
      .gte("starts_at", new Date(Date.now() - 86400000).toISOString())
      .eq("status", "scheduled"),
    supabase
      .from("booking_blackouts")
      .select("starts_at, ends_at, event_type_id")
      .gte("ends_at", new Date().toISOString()),
  ]);

  const slots = generateSlots({
    eventType,
    availability: (availability || []) as AvailabilityRule[],
    busy: (busy || []).map((b) => ({ starts_at: b.starts_at, ends_at: b.ends_at })),
    blackouts: (blackouts || [])
      .filter((b) => !b.event_type_id || b.event_type_id === eventType.id)
      .map((b) => ({ starts_at: b.starts_at, ends_at: b.ends_at })),
    timeZone,
    days,
  });

  return { slots, timeZone };
}
