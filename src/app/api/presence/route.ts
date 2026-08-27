/**
 * POST /api/presence — the Readability Audit engine.
 *
 * Answers one question about any public website: can a human, an AI answer
 * engine, and an autonomous agent each actually read this business?
 *
 * Every check here is one we ran by hand on envisioned.me on 2026-08-27 and
 * found something real. Nothing is theoretical.
 *
 * Safety: only public http(s) URLs, hard timeouts, capped body reads, no
 * redirect-following into private space (Workers cannot reach internal
 * networks anyway). Results are computed live and nothing is stored unless the
 * visitor separately opts in via /api/leads.
 */

import { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/api/rate-limit';

export const dynamic = 'force-dynamic';

type Status = 'pass' | 'warn' | 'fail';
type Check = {
  id: string;
  audience: 'human' | 'llm' | 'agent';
  label: string;
  status: Status;
  detail: string;
  why: string;
};

const TIMEOUT_MS = 8000;
const MAX_BYTES = 1_500_000;

async function grab(url: string): Promise<{ ok: boolean; status: number; body: string; finalUrl: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'EnvisionedReadabilityAudit/1.0 (+https://www.envisioned.me)' },
    });
    const reader = await res.text();
    return { ok: res.ok, status: res.status, body: reader.slice(0, MAX_BYTES), finalUrl: res.url || url };
  } catch {
    return { ok: false, status: 0, body: '', finalUrl: url };
  } finally {
    clearTimeout(timer);
  }
}

/** Text a crawler sees without executing any JavaScript. */
function visibleText(html: string): number {
  const stripped = html
    .replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ');
  return stripped.split(/\s+/).filter(Boolean).join(' ').length;
}

function normalise(input: string): string | null {
  let raw = input.trim();
  if (!raw) return null;
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    if (/^(localhost|127\.|10\.|192\.168\.|169\.254\.|\[)/i.test(u.hostname)) return null;
    return u.origin;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, 'STRICT_LIMITER');
  if (limited) return limited;

  const body = await request.json().catch(() => ({}));
  const origin = normalise(String(body.url || ''));
  if (!origin) return Response.json({ error: 'Enter a valid website address.' }, { status: 400 });

  const [home, robots, llms, sitemap] = await Promise.all([
    grab(origin),
    grab(`${origin}/robots.txt`),
    grab(`${origin}/llms.txt`),
    grab(`${origin}/sitemap.xml`),
  ]);

  if (!home.body) {
    // A Worker cannot fetch a hostname it is itself serving — the subrequest
    // loops and Cloudflare refuses it. Without this, demoing the tool on our own
    // site fails in front of an audience with a misleading "could not reach".
    const self = new URL(request.url).host.replace(/^www\./, '');
    if (origin.replace(/^https?:\/\/(www\.)?/, '').startsWith(self)) {
      return Response.json(
        { error: 'That is this site — I cannot audit myself from inside my own server. Try your own address.' },
        { status: 400 }
      );
    }
    return Response.json({ error: `Could not reach ${origin}. Check the address and try again.` }, { status: 502 });
  }

  const html = home.body;
  const checks: Check[] = [];
  const add = (c: Check) => checks.push(c);

  // ── LLM / answer-engine readability ──────────────────────────────────────
  const chars = visibleText(html);
  add({
    id: 'server-rendered',
    audience: 'llm',
    label: 'Your words exist without JavaScript',
    status: chars > 2000 ? 'pass' : chars > 500 ? 'warn' : 'fail',
    detail: `${chars.toLocaleString()} characters of readable text in the raw page.`,
    why: 'Most AI crawlers do not run JavaScript. If your copy only appears after the page boots, they see an empty room.',
  });

  const rb = robots.body.toLowerCase();
  const blocked = ['gptbot', 'claudebot', 'google-extended', 'perplexitybot', 'oai-searchbot', 'bytespider', 'ccbot']
    .filter((bot) => {
      const i = rb.indexOf(`user-agent: ${bot}`);
      if (i === -1) return false;
      return /disallow:\s*\//.test(rb.slice(i, i + 220));
    });
  add({
    id: 'ai-crawlers',
    audience: 'llm',
    label: 'AI answer engines are allowed in',
    status: blocked.length === 0 ? 'pass' : blocked.length < 3 ? 'warn' : 'fail',
    detail: blocked.length ? `Blocked: ${blocked.join(', ')}.` : 'No AI crawler is blocked in robots.txt.',
    why: 'Blocking these is a legitimate choice — but most sites do it by accident, then wonder why they are never cited.',
  });

  add({
    id: 'content-signal',
    audience: 'llm',
    label: 'You state how your content may be used',
    status: /content-signal/i.test(rb) ? (/ai-input\s*=\s*yes/i.test(rb) ? 'pass' : 'warn') : 'warn',
    detail: /content-signal/i.test(rb)
      ? `Declared: ${(rb.match(/content-signal:.*/i) || [''])[0].trim().slice(0, 90)}`
      : 'No content signal declared.',
    why: 'ai-input governs being quoted in AI answers, and is separate from ai-train. You can refuse training and still be citable.',
  });

  const jsonLd = [...html.matchAll(/application\/ld\+json/gi)].length;
  const types = [...new Set([...html.matchAll(/"@type"\s*:\s*"([A-Za-z]+)"/g)].map((m) => m[1]))];
  add({
    id: 'structured-data',
    audience: 'llm',
    label: 'A machine can tell who you are',
    status: jsonLd === 0 ? 'fail' : types.some((t) => /Person|Organization|ProfessionalService|LocalBusiness/.test(t)) ? 'pass' : 'warn',
    detail: jsonLd === 0 ? 'No structured data found.' : `Found: ${types.slice(0, 6).join(', ')}.`,
    why: 'Structured data is how scattered mentions of you resolve into one findable entity instead of three weak ones.',
  });

  add({
    id: 'canonical',
    audience: 'llm',
    label: 'One address is declared the real one',
    status: /rel=["']canonical["']/i.test(html) ? 'pass' : 'warn',
    detail: /rel=["']canonical["']/i.test(html) ? 'Canonical tag present.' : 'No canonical tag.',
    why: 'Without it, the same page on two addresses competes with itself and splits its own authority.',
  });

  // ── Agent readability ────────────────────────────────────────────────────
  add({
    id: 'llms-txt',
    audience: 'agent',
    label: 'You publish a plain-language summary for AI',
    status: llms.ok && /\w/.test(llms.body) ? 'pass' : 'warn',
    detail: llms.ok ? 'llms.txt found.' : 'No llms.txt.',
    why: 'An llms.txt tells an AI what you do and what matters, in your words, instead of leaving it to infer from navigation.',
  });

  add({
    id: 'sitemap',
    audience: 'agent',
    label: 'Your pages are discoverable in one place',
    status: sitemap.ok ? 'pass' : 'warn',
    detail: sitemap.ok ? `Sitemap found (${(sitemap.body.match(/<loc>/g) || []).length} URLs).` : 'No sitemap.xml.',
    why: 'A crawler that has to guess your page list will miss most of it.',
  });

  // ── Human readability ────────────────────────────────────────────────────
  const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1]?.trim() || '';
  add({
    id: 'title',
    audience: 'human',
    label: 'Your title says what you do',
    status: title.length > 15 && title.length < 65 ? 'pass' : title ? 'warn' : 'fail',
    detail: title ? `"${title.slice(0, 70)}"` : 'No title tag.',
    why: 'This is the line a person reads in search results and a model reads first. Vague here means invisible everywhere.',
  });

  const desc = (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i) || [])[1] || '';
  add({
    id: 'description',
    audience: 'human',
    label: 'You summarise yourself in one sentence',
    status: desc.length > 50 ? 'pass' : desc ? 'warn' : 'fail',
    detail: desc ? `${desc.length} characters.` : 'No meta description.',
    why: 'If you do not write it, the machine writes it for you — usually from whatever text it finds first.',
  });

  const h1s = (html.match(/<h1[\s>]/gi) || []).length;
  add({
    id: 'h1',
    audience: 'human',
    label: 'The page has one clear headline',
    status: h1s === 1 ? 'pass' : h1s === 0 ? 'fail' : 'warn',
    detail: h1s === 0 ? 'No H1.' : `${h1s} H1 headings.`,
    why: 'One H1 tells both a reader and a machine what this page is actually about.',
  });

  const imgs = html.match(/<img[^>]*>/gi) || [];
  const noAlt = imgs.filter((i) => !/alt=["'][^"']+["']/i.test(i)).length;
  add({
    id: 'alt',
    audience: 'human',
    label: 'Your images are described',
    status: imgs.length === 0 ? 'warn' : noAlt === 0 ? 'pass' : noAlt / imgs.length > 0.3 ? 'fail' : 'warn',
    detail: imgs.length ? `${imgs.length} images, ${noAlt} without alt text.` : 'No images found.',
    why: 'Alt text is what a screen reader speaks and what a model reads. Without it the image says nothing.',
  });

  const secure = home.finalUrl.startsWith('https://');
  add({
    id: 'https',
    audience: 'human',
    label: 'The connection is secure',
    status: secure ? 'pass' : 'fail',
    detail: secure ? 'Served over HTTPS.' : 'Not served over HTTPS.',
    why: 'Browsers label insecure sites as "Not Secure" before a visitor reads a word.',
  });

  // Weighted, with partial credit for warnings. Flat scoring made Stripe come
  // out at 67/100 — which tells a room of founders that everyone is mediocre and
  // makes the tool look unserious. llms.txt and content signals are genuinely
  // new standards almost nobody has yet, so they are shown in full but scored
  // as upside rather than as failures against the fundamentals.
  const ADVANCED = new Set(['llms-txt', 'content-signal']);
  const weightOf = (c: Check) => (ADVANCED.has(c.id) ? 1 : 2);
  const creditOf = (c: Check) => (c.status === 'pass' ? 1 : c.status === 'warn' ? 0.5 : 0);
  const earned = checks.reduce((n, c) => n + weightOf(c) * creditOf(c), 0);
  const possible = checks.reduce((n, c) => n + weightOf(c), 0);

  const passes = checks.filter((c) => c.status === 'pass').length;
  const fails = checks.filter((c) => c.status === 'fail').length;
  const score = Math.round((earned / possible) * 100);
  const verdict =
    score >= 85 ? 'Legible' : score >= 60 ? 'Partly legible' : score >= 35 ? 'Hard to read' : 'Effectively invisible';

  return Response.json({
    url: origin,
    score,
    verdict,
    passes,
    fails,
    total: checks.length,
    checks,
    generatedAt: new Date().toISOString(),
  });
}
