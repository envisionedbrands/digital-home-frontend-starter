import { NextRequest, NextResponse } from 'next/server';
import { signedCrmPost } from '@/lib/crm/backend';

const EVENT_TYPES = new Set(['start', 'view', 'complete', 'cta_click']);
const clean = (value: unknown, max: number): string | null =>
  typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : null;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const sessionId = clean(body.sessionId, 100);
  const eventType = clean(body.eventType, 40);
  if (!sessionId || !eventType || !EVENT_TYPES.has(eventType)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const response = await signedCrmPost('/api/crm/funnel/ingest', {
      funnel: 'founder-access',
      events: [{
        session_id: sessionId,
        event_type: eventType,
        event_data: body.eventData && typeof body.eventData === 'object' ? body.eventData : {},
        page_url: clean(body.pageUrl, 500),
        referrer: clean(body.referrer, 500),
      }],
    });
    return NextResponse.json({ ok: response.ok });
  } catch (error) {
    console.error('[founder-access] funnel event failed', error);
    return NextResponse.json({ ok: false });
  }
}
