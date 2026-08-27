import { createHmac } from 'crypto';

function crmUrl(pathname: string): string {
  const base = process.env.CRM_BACKEND_URL || 'http://localhost:3001';
  return `${base.replace(/\/$/, '')}${pathname}`;
}

export async function signedCrmPost(pathname: string, payload: unknown): Promise<Response> {
  const apiKey = process.env.API_SECRET_KEY;
  if (!apiKey) throw new Error('CRM connection is not configured');

  const body = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const secret = process.env.API_REQUEST_SIGNING_SECRET || apiKey;
  const signature = createHmac('sha256', secret)
    .update(`POST:${pathname}:${timestamp}:${body}`)
    .digest('hex');

  return fetch(crmUrl(pathname), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'x-timestamp': timestamp,
      'x-signature': signature,
    },
    body,
    cache: 'no-store',
  });
}
