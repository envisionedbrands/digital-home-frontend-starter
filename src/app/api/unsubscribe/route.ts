/**
 * Unsubscribe endpoint.
 *
 * Two callers, deliberately handled differently:
 *
 *  1. Gmail / Yahoo one-click (RFC 8058). They POST here with the form body
 *     `List-Unsubscribe=One-Click` because the email carries a
 *     `List-Unsubscribe-Post` header. They expect a plain 2xx and never show
 *     the response to anyone, so we answer with JSON and no redirect.
 *
 *  2. A human who clicked the footer link, landed on /unsubscribe and pressed
 *     the confirm button. That form POSTs here too; we redirect back to the
 *     page so they see a confirmation rather than raw JSON.
 *
 * GET never unsubscribes anyone. Mail scanners and link-prefetchers follow
 * every URL in an email, and a mutating GET would silently unsubscribe people
 * who never asked. GET just bounces to the page, which asks first.
 *
 * This writes straight to Supabase rather than calling the backend, because
 * both apps share one database and the backend<->frontend shared secret is a
 * separate moving part. An unsubscribe must never fail because an API key
 * drifted - a failed unsubscribe becomes a spam complaint.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

function tokenFrom(request: NextRequest, bodyToken?: string | null): string {
  return (bodyToken || request.nextUrl.searchParams.get('t') || '').trim();
}

/** Flip the lead to unsubscribed. Idempotent: unsubscribing twice is fine. */
async function unsubscribe(token: string): Promise<'ok' | 'already' | 'invalid'> {
  if (!token) return 'invalid';

  const supabase = createAdminClient();
  const { data: lead } = await supabase
    .from('leads')
    .select('id, email_status')
    .eq('unsubscribe_token', token)
    .maybeSingle();

  if (!lead) return 'invalid';
  if (lead.email_status === 'unsubscribed') return 'already';

  const { error } = await supabase
    .from('leads')
    .update({ email_status: 'unsubscribed' })
    .eq('id', lead.id);

  if (error) throw new Error(error.message);

  // Mirrors the pattern the Resend webhook uses for complaints, so the two
  // suppression paths look the same on a lead's timeline.
  await supabase.from('lead_activities').insert({
    lead_id: lead.id,
    activity_type: 'unsubscribed',
    title: 'Unsubscribed via email link',
    data: {},
    actor: 'system',
  });
  await supabase
    .from('leads')
    .update({ last_activity_at: new Date().toISOString() })
    .eq('id', lead.id);

  return 'ok';
}

export async function POST(request: NextRequest) {
  let bodyToken: string | null = null;
  let oneClick = false;

  // One-click sends application/x-www-form-urlencoded. So does our own form.
  try {
    const form = await request.formData();
    oneClick = form.get('List-Unsubscribe') === 'One-Click';
    const t = form.get('t');
    if (typeof t === 'string') bodyToken = t;
  } catch {
    // No form body (some clients send an empty POST) - fall back to the query.
  }

  const token = tokenFrom(request, bodyToken);

  let result: 'ok' | 'already' | 'invalid';
  try {
    result = await unsubscribe(token);
  } catch {
    // Never surface a 500 to a mail client - it may retry or, worse, the user
    // gives up and hits spam. Log-and-soften.
    if (oneClick) return NextResponse.json({ ok: false }, { status: 200 });
    return NextResponse.redirect(new URL('/unsubscribe?state=error', request.url), 303);
  }

  if (oneClick) {
    // RFC 8058: any 2xx means "done". Gmail shows its own confirmation.
    return NextResponse.json({ ok: result !== 'invalid' }, { status: 200 });
  }

  const state = result === 'invalid' ? 'invalid' : 'done';
  return NextResponse.redirect(new URL(`/unsubscribe?state=${state}`, request.url), 303);
}

/** A link click, a prefetcher, or a scanner. Show the page; change nothing. */
export async function GET(request: NextRequest) {
  const t = request.nextUrl.searchParams.get('t') || '';
  const url = new URL('/unsubscribe', request.url);
  if (t) url.searchParams.set('t', t);
  return NextResponse.redirect(url, 303);
}
