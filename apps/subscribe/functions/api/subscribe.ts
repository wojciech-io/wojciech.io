import { confirmationEmail } from '../../src/email/confirmation';

interface Env {
  SUBSCRIBE_KV: KVNamespace;
  RESEND_API_KEY: string;
  RESEND_FROM?: string;
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
  let email: string | undefined;

  try {
    const body = (await request.json()) as { email?: string };
    email = body.email?.trim().toLowerCase();
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  if (!email || !emailPattern.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
  }

  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: 'Email service not configured.' }, { status: 503 });
  }

  // Generate confirmation token, store in KV with 24h TTL
  const token = crypto.randomUUID();
  await env.SUBSCRIBE_KV.put(`pending:${token}`, email, { expirationTtl: 86400 });

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
