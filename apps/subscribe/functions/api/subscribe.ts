import { confirmationEmail } from '../../src/email/confirmation';
import { rateLimit, clientIp } from '../_utils/ratelimit';

interface Env {
  SUBSCRIBE_KV: KVNamespace;
  RESEND_API_KEY: string;
  RESEND_FROM?: string;
  RATE_LIMIT?: KVNamespace;
}

interface PagesFunctionContext {
  request: Request;
  env: Env;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FROM = 'Wojciech from AI Espresso <hello@wojciech.io>';
const SITE_URL = 'https://subscribe.wojciech.io';

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...init.headers },
  });
}

export async function onRequestPost({ request, env }: PagesFunctionContext) {
  // Anti-abuse: 5 signups / 10 min / IP (protects Resend quota).
  const rl = await rateLimit(env.RATE_LIMIT, `subscribe:${clientIp(request)}`, 5, 600);
  if (!rl.ok) return rl.response!;

  let email: string | undefined;
  let consent = false;

  try {
    const body = (await request.json()) as { email?: string; consent?: boolean };
    email = body.email?.trim().toLowerCase();
    consent = body.consent === true;
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  if (!email || !emailPattern.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
  }

  if (!consent) {
    return json({ ok: false, error: 'Consent is required to subscribe.' }, { status: 400 });
  }

  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: 'Email service not configured.' }, { status: 503 });
  }

  // Confirmation token in KV, 24h TTL. The value records when consent was
  // given so the double opt-in trail is complete: consent at signup,
  // confirmation timestamped by the confirm request itself.
  const token = crypto.randomUUID();
  await env.SUBSCRIBE_KV.put(
    `pending:${token}`,
    JSON.stringify({ email, consentAt: new Date().toISOString() }),
    { expirationTtl: 86400 }
  );

  const confirmUrl = `${SITE_URL}/api/confirm?token=${token}`;
  const html = confirmationEmail({ email, confirmUrl });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM || FROM,
      to: [email],
      subject: 'Confirm your AI Espresso subscription',
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Resend error:', err);
    return json({ ok: false, error: 'Failed to send confirmation email. Try again.' }, { status: 502 });
  }

  return json({ ok: true });
}

export function onRequestGet() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405 });
}

// Explicit handler so Cloudflare Pages does not answer preflight with a permissive
// Access-Control-Allow-Origin: *. This endpoint is same-origin only; no CORS needed.
export function onRequestOptions() {
  return new Response(null, { status: 405, headers: { allow: 'POST', 'cache-control': 'no-store' } });
}
