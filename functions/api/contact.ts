import { rateLimit, clientIp } from '../_utils/ratelimit';

interface PagesFunctionContext {
  request: Request;
  env: {
    RESEND_API_KEY?: string;
    RATE_LIMIT?: KVNamespace;
  };
}

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...init.headers,
    },
  });
}

export async function onRequestPost({ request, env }: PagesFunctionContext) {
  // Anti-abuse: 5 messages / 10 min / IP (protects Resend quota and the inbox).
  const rl = await rateLimit(env.RATE_LIMIT, `contact:${clientIp(request)}`, 5, 600);
  if (!rl.ok) return rl.response!;

  let payload: ContactPayload;

  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, email, message } = payload;

  if (!name || typeof name !== 'string' || name.trim().length < 1) {
    return json({ error: 'Name is required' }, { status: 400 });
  }
  if (!email || typeof email !== 'string' || !emailPattern.test(email)) {
    return json({ error: 'Valid email is required' }, { status: 400 });
  }
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    return json({ error: 'Message must be at least 10 characters' }, { status: 400 });
  }

  if (!env.RESEND_API_KEY) {
    return json({ error: 'Contact form not configured' }, { status: 503 });
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Contact Form <contact@wojciech.io>',
      to: 'hello@wojciech.io',
      reply_to: email.trim(),
      subject: `[wojciech.io] ${name.trim()}`,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
    }),
  });

  if (!res.ok) {
    return json({ error: 'Failed to send' }, { status: 502 });
  }

  return json({ ok: true });
}
