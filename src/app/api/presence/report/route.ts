/**
 * POST /api/presence/report — capture the lead AND email the audit.
 *
 * The Readability Audit page used to POST straight to /api/leads and then say
 * "Sent. Check your inbox." Nothing sent anything: no email was ever built, and
 * RESEND_API_KEY was never set on this Worker. So the page promised a report
 * that could not arrive, and confirmed success either way.
 *
 * This route tells the truth: it returns { captured, sent } and the page says
 * only what actually happened.
 */

import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend';
import { checkRateLimit } from '@/lib/api/rate-limit';

export const dynamic = 'force-dynamic';

type Check = { audience: string; label: string; status: string; detail: string; why: string };

const AUD: Record<string, string> = { human: 'Humans', llm: 'AI answer engines', agent: 'Agents' };
const MARK: Record<string, string> = { pass: '&#9679;', warn: '&#9680;', fail: '&#9675;' };
const COLOUR: Record<string, string> = { pass: '#4C5A2E', warn: '#B87A5D', fail: '#8C3A2E' };

function esc(v: unknown) {
  return String(v ?? '').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] as string));
}

function buildHtml(url: string, score: number, verdict: string, checks: Check[]) {
  const groups = ['human', 'llm', 'agent']
    .map((a) => {
      const items = checks.filter((c) => c.audience === a);
      if (!items.length) return '';
      const rows = items
        .map(
          (c) => `<tr><td style="padding:10px 0;border-bottom:1px solid #e7e2da;vertical-align:top">
            <span style="color:${COLOUR[c.status] || '#1E1E1E'};font-size:15px">${MARK[c.status] || ''}</span>
            <strong style="color:#1E1E1E"> ${esc(c.label)}</strong><br />
            <span style="color:#4a4a4a">${esc(c.detail)}</span>
            ${c.status !== 'pass' ? `<br /><em style="color:#6b6b6b">${esc(c.why)}</em>` : ''}
          </td></tr>`
        )
        .join('');
      return `<h3 style="font-family:Georgia,serif;font-size:17px;color:#1E1E1E;margin:26px 0 6px">${AUD[a]}</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="font-family:-apple-system,Segoe UI,sans-serif;font-size:14px">${rows}</table>`;
    })
    .join('');

  const failing = checks.filter((c) => c.status !== 'pass').slice(0, 3);
  const first = failing.length
    ? `<ol style="font-family:-apple-system,Segoe UI,sans-serif;font-size:14px;color:#1E1E1E;padding-left:18px">
        ${failing.map((c) => `<li style="margin-bottom:8px"><strong>${esc(c.label)}</strong> — ${esc(c.why)}</li>`).join('')}
      </ol>`
    : `<p style="font-family:-apple-system,Segoe UI,sans-serif;font-size:14px">Nothing is failing. That is rare.</p>`;

  return `<div style="max-width:620px;margin:0 auto;padding:32px 24px;background:#FBFAF9">
    <p style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#4C5A2E">The Readability Audit</p>
    <h1 style="font-family:Georgia,serif;font-size:26px;line-height:1.2;color:#1E1E1E;margin:14px 0 4px">${esc(url)}</h1>
    <p style="font-family:Georgia,serif;font-size:20px;color:#1E1E1E;margin:0">${esc(verdict)} — ${score}/100</p>
    <p style="font-family:-apple-system,Segoe UI,sans-serif;font-size:14px;line-height:1.6;color:#4a4a4a;margin-top:18px">
      This is whether a person, an AI answer engine and an autonomous agent can each work out
      what your business does, who it serves and what it sells. Not a beauty contest.
    </p>
    <h2 style="font-family:Georgia,serif;font-size:19px;color:#1E1E1E;margin:30px 0 8px">What I would fix first</h2>
    ${first}
    ${groups}
    <p style="font-family:-apple-system,Segoe UI,sans-serif;font-size:13px;color:#6b6b6b;margin-top:32px;border-top:1px solid #e7e2da;padding-top:18px">
      Run it again any time at <a href="https://www.envisioned.me/readability" style="color:#4C5A2E">envisioned.me/readability</a>.<br />
      — Maria-Ines, Envisioned
    </p>
  </div>`;
}

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, 'STRICT_LIMITER');
  if (limited) return limited;

  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const url = String(body.url || '');
  const score = Number(body.score) || 0;
  const verdict = String(body.verdict || '');
  const checks: Check[] = Array.isArray(body.checks) ? body.checks.slice(0, 40) : [];

  // 1. Capture, always. Losing the lead because the mail server is unhappy
  //    would be the worse failure of the two.
  let captured = false;
  try {
    const supabase = createAdminClient();
    const { data: existing } = await supabase.from('leads').select('id, tags').eq('email', email).single();
    if (existing) {
      // MERGE, never replace. Overwriting wiped the existing tags off a
      // returning lead — including, in testing, MI's own record. A returning
      // visitor must not lose their history by running a free audit.
      const merged = Array.from(
        new Set([...(existing.tags || []), 'readability-audit', `score-${score}`])
      );
      await supabase.from('leads').update({ tags: merged }).eq('id', existing.id);
    } else {
      await supabase.from('leads').insert({
        email,
        source: 'readability-audit',
        capture_page: '/readability',
        status: 'new',
        score: 0,
        tags: ['readability-audit', `score-${score}`],
        interested_offers: [],
      });
    }
    captured = true;
  } catch (e) {
    console.error('[readability] capture failed', e);
  }

  // 2. Then try to send. Reports honestly whether it went.
  let sent = false;
  let reason = '';
  const result = await sendEmail({
    to: email,
    subject: `Your Readability Audit — ${url} (${score}/100)`,
    html: buildHtml(url, score, verdict, checks),
    from: process.env.RESEND_FROM_ADDRESS || 'Maria-Ines <hello@mariaines.co>',
    replyTo: 'hello@mariaines.co',
    tags: [{ name: 'type', value: 'readability-audit' }],
  });
  if ('id' in result) sent = true;
  else {
    reason = result.error;
    console.warn('[readability] email not sent:', reason);
  }

  return Response.json({ captured, sent });
}
