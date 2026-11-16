import { woodyConfirmationEmail, woodyAlreadyEmail } from '../../src/email/woody';
import { rateLimit, clientIp } from '../_utils/ratelimit';

// The waiting list of Woody (wojciech.io/woody): one address, one box ticked, one email that asks the person to confirm it (double opt in), and a list in KV that only the
// confirmation writes to (functions/api/woody-confirm.ts). It is a list of its own: nothing here touches the AI Espresso audience. The page calls it from another origin, so
// it answers only to the Woody page, and a request from anywhere else is refused.
//   KV keys (the SUBSCRIBE_KV of this app):  woody-pending:<token> 24 h, woody:<email> the list, woody-confirmed:<token> 30 days
//   The list:  npx wrangler kv key list --binding SUBSCRIBE_KV --prefix woody:   (values hold the time of the consent and of the confirmation)

interface Env {
  SUBSCRIBE_KV: KVNamespace;
  RESEND_API_KEY: string;
  WOODY_FROM?: string;
  RATE_LIMIT?: KVNamespace;
}

interface PagesFunctionContext {
  request: Request;
  env: Env;
}

const ALLOWED_ORIGINS = new Set(['https://wojciech.io']);
const FROM = 'Wojciech from Woody <hello@wojciech.io>';
const SITE_URL = 'https://subscribe.wojciech.io';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cors = (origin: string): Record<string, string> => (ALLOWED_ORIGINS.has(origin)
  ? { 'access-control-allow-origin': origin, vary: 'Origin' }
  : { vary: 'Origin' });

function json(data: unknown, origin: string, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...cors(origin), ...init.headers },
  });
}

async function digest(text: string): Promise<string> {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

async function send(env: Env, to: string, mail: { subject: string; html: string; text: string }): Promise<boolean> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.WOODY_FROM || FROM, to: [to], reply_to: 'hello@wojciech.io', subject: mail.subject, html: mail.html, text: mail.text }),
  });
  if (!res.ok) console.error('Resend error:', res.status, await res.json().catch(() => ({})));
  return res.ok;
}

export async function onRequestPost({ request, env }: PagesFunctionContext) {
  const origin = request.headers.get('Origin') ?? '';
  if (!ALLOWED_ORIGINS.has(origin)) return json({ ok: false, error: 'Not allowed.' }, origin, { status: 403 });

  // Anti-abuse: 5 requests / 10 min / IP, and below 3 emails / hour to one address (nobody can fill someone else's inbox).
  const rl = await rateLimit(env.RATE_LIMIT, `woody:${clientIp(request)}`, 5, 600);
  if (!rl.ok) return new Response(rl.response!.body, { status: 429, headers: { ...Object.fromEntries(rl.response!.headers), ...cors(origin) } });

  let email: string | undefined;
  let consent = false;
  let trap = '';
  try {
    const body = (await request.json()) as { email?: string; consent?: boolean; company?: string };
    email = body.email?.trim().toLowerCase();
    consent = body.consent === true;
    trap = String(body.company ?? '');
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, origin, { status: 400 });
  }

  if (trap) return json({ ok: true }, origin); // a form filled by a script: the field is hidden from people
  if (!email || email.length > 254 || !emailPattern.test(email)) return json({ ok: false, error: 'Please enter a valid email address.' }, origin, { status: 400 });
  if (!consent) return json({ ok: false, error: 'Please tick the box, so I know you agree.' }, origin, { status: 400 });
  if (!env.RESEND_API_KEY) return json({ ok: false, error: 'The email service is not set up yet. Please write to hello@wojciech.io.' }, origin, { status: 503 });

  const each = await rateLimit(env.RATE_LIMIT, `woody-to:${await digest(email)}`, 3, 3600);
  if (!each.ok) return json({ ok: true }, origin); // the same answer as for a sent email, and nothing more is sent

  // On the list already: say so by email, and answer exactly as for a new address, so the page cannot be used to find out who is on the list.
  if (await env.SUBSCRIBE_KV.get(`woody:${email}`)) {
    await send(env, email, woodyAlreadyEmail());
    return json({ ok: true }, origin);
  }

  // The token lives 24 hours. The value records when the consent was given, so the trail of the double opt in is complete: consent here, confirmation timestamped by the click.
  const token = crypto.randomUUID();
  await env.SUBSCRIBE_KV.put(`woody-pending:${token}`, JSON.stringify({ email, consentAt: new Date().toISOString() }), { expirationTtl: 86400 });
  const sent = await send(env, email, woodyConfirmationEmail({ confirmUrl: `${SITE_URL}/api/woody-confirm?token=${token}` }));
  if (!sent) return json({ ok: false, error: 'The email did not go out. Try again in a minute, or write to hello@wojciech.io.' }, origin, { status: 502 });
  return json({ ok: true }, origin);
}

export function onRequestOptions({ request }: PagesFunctionContext) {
  const origin = request.headers.get('Origin') ?? '';
  if (!ALLOWED_ORIGINS.has(origin)) return new Response(null, { status: 403, headers: { 'cache-control': 'no-store' } });
  return new Response(null, {
    status: 204,
    headers: { ...cors(origin), 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type', 'access-control-max-age': '86400', 'cache-control': 'no-store' },
  });
}

export function onRequestGet() {
  return new Response(JSON.stringify({ ok: false, error: 'Method not allowed.' }), { status: 405, headers: { 'content-type': 'application/json; charset=utf-8', allow: 'POST, OPTIONS', 'cache-control': 'no-store' } });
}
