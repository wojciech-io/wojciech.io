import { createOpaqueToken, hmacHex, sha256 } from '../_utils/crypto';

interface Env {
  DB?: D1Database;
  STRIPE_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  ACADEMY_BASE_URL?: string;
}

interface StripeSession {
  id: string;
  customer?: string;
  client_reference_id?: string;
  customer_email?: string;
  customer_details?: { email?: string; name?: string };
  payment_status?: string;
  metadata?: { plan?: string; name?: string; email?: string };
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB || !env.STRIPE_WEBHOOK_SECRET) {
    return new Response('Webhook not configured', { status: 500 });
  }

  const raw = await request.text();
  const sig = request.headers.get('Stripe-Signature') || '';
  if (!(await verifyStripeSignature(raw, sig, env.STRIPE_WEBHOOK_SECRET))) {
    return new Response('Invalid signature', { status: 400 });
  }

  const event = JSON.parse(raw) as { id: string; type: string; data: { object: unknown } };
  const inserted = await env.DB.prepare(
    `INSERT OR IGNORE INTO stripe_events (id, type, payload_json)
     VALUES (?, ?, ?)`
  ).bind(event.id, event.type, raw).run();
  const isNewEvent = (inserted.meta as { changes?: number } | undefined)?.changes !== 0;
  if (!isNewEvent) return json({ received: true, duplicate: true });

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    await handleCheckoutCompleted(env, event.data.object as StripeSession, request);
  }

  return json({ received: true });
};

async function verifyStripeSignature(raw: string, signature: string, secret: string): Promise<boolean> {
  const parts = Object.fromEntries(signature.split(',').map((part) => {
    const [k, v] = part.split('=');
    return [k, v];
  }));
  if (!parts.t || !parts.v1) return false;
  const age = Math.abs(Date.now() / 1000 - Number(parts.t));
  if (!Number.isFinite(age) || age > 300) return false;
  const expected = await hmacHex(secret, `${parts.t}.${raw}`);
  return expected === parts.v1;
}

async function handleCheckoutCompleted(env: Env, session: StripeSession, request: Request): Promise<void> {
  const email = (session.customer_details?.email || session.customer_email || session.metadata?.email || session.client_reference_id || '').trim().toLowerCase();
  if (!email || !env.DB) return;

  const customerId = `cus_${crypto.randomUUID()}`;
  const existing = await env.DB.prepare('SELECT id FROM customers WHERE email = ?').bind(email).first<{ id: string }>();
  const id = existing?.id || customerId;
  const name = session.customer_details?.name || session.metadata?.name || null;
  const plan = session.metadata?.plan || 'cohort';
  const paid = session.payment_status === 'paid' || session.payment_status === 'no_payment_required';
  const accessExpiresAt = addMonthsIso(new Date(), 12);

  await env.DB.prepare(
    `INSERT INTO customers (id, email, name, stripe_customer_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     ON CONFLICT(email) DO UPDATE SET
       name=COALESCE(excluded.name, customers.name),
       stripe_customer_id=COALESCE(excluded.stripe_customer_id, customers.stripe_customer_id),
       updated_at=CURRENT_TIMESTAMP`
  ).bind(id, email, name, session.customer || null).run();

  await env.DB.prepare(
    `INSERT INTO memberships (id, customer_id, plan, status, stripe_checkout_session_id, access_expires_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     ON CONFLICT(stripe_checkout_session_id) DO UPDATE SET
       plan=excluded.plan,
       status=excluded.status,
       access_expires_at=?,
       updated_at=CURRENT_TIMESTAMP`
  ).bind(
    `mem_${crypto.randomUUID()}`,
    id,
    plan,
    paid ? 'active' : 'pending',
    session.id,
    paid ? accessExpiresAt : null,
    paid ? accessExpiresAt : null,
  ).run();

  if (paid) {
    await sendWelcomeMagicLink(env, email, request);
  }
}

async function sendWelcomeMagicLink(env: Env, email: string, request: Request): Promise<void> {
  if (!env.DB) return;
  const token = createOpaqueToken();
  const tokenHash = await sha256(token);
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString();

  await env.DB.prepare(
    `INSERT INTO auth_tokens (id, email, token_hash, redirect_path, expires_at)
     VALUES (?, ?, ?, '/app', ?)`
  ).bind(crypto.randomUUID(), email, tokenHash, expires).run();

  if (!env.RESEND_API_KEY) return;
  const origin = env.ACADEMY_BASE_URL || new URL(request.url).origin;
  const magicUrl = `${origin.replace(/\/$/, '')}/api/auth?token=${encodeURIComponent(token)}`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM || 'AI Growth OS <hello@academy.wojciech.io>',
      to: email,
      subject: 'Dostęp do AI Growth OS Academy',
      html: `<div style="font-family:-apple-system,system-ui,sans-serif;max-width:560px">
        <h2 style="margin:0 0 12px;color:#0a0a0a">Dostęp do Academy jest aktywny</h2>
        <p style="color:#3f3f46;line-height:1.55">Płatność przeszła. Kliknij link, żeby wejść do panelu z odcinkami, vaultem i materiałami wdrożeniowymi.</p>
        <p><a href="${magicUrl.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}" style="display:inline-block;background:#ff7a1c;color:#0a0a0c;padding:12px 18px;border-radius:10px;font-weight:700;text-decoration:none">Otwórz panel</a></p>
        <p style="font-size:12px;color:#71717a">Link działa 48 godzin i jest jednorazowy. Później zawsze możesz wygenerować nowy przez stronę logowania.</p>
      </div>`,
    }),
  });
}

function addMonthsIso(date: Date, months: number): string {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next.toISOString();
}

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
