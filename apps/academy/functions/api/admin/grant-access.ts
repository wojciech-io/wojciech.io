import { createOpaqueToken, sha256 } from '../../_utils/crypto';

interface Env {
  DB?: D1Database;
  ACADEMY_ADMIN_TOKEN?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  ACADEMY_BASE_URL?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB || !env.ACADEMY_ADMIN_TOKEN) {
    return json({ ok: false, error: 'admin-not-configured' }, 500);
  }

  const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '').trim();
  if (!token || token !== env.ACADEMY_ADMIN_TOKEN) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }

  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch {}
  const email = String(body.email || '').trim().toLowerCase();
  const name = String(body.name || '').trim() || null;
  const plan = String(body.plan || 'cohort').trim() || 'cohort';
  if (!/^\S+@\S+\.\S+$/.test(email)) return json({ ok: false, error: 'invalid-email' }, 400);

  const existing = await env.DB.prepare('SELECT id FROM customers WHERE email = ?').bind(email).first<{ id: string }>();
  const customerId = existing?.id || `manual_${crypto.randomUUID()}`;
  const accessExpiresAt = addMonthsIso(new Date(), 12);

  await env.DB.prepare(
    `INSERT INTO customers (id, email, name, created_at, updated_at)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     ON CONFLICT(email) DO UPDATE SET
       name=COALESCE(excluded.name, customers.name),
       updated_at=CURRENT_TIMESTAMP`
  ).bind(customerId, email, name).run();

  await env.DB.prepare(
    `INSERT INTO memberships (id, customer_id, plan, status, stripe_checkout_session_id, access_expires_at, created_at, updated_at)
     VALUES (?, ?, ?, 'active', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     ON CONFLICT(stripe_checkout_session_id) DO UPDATE SET
       status='active',
       access_expires_at=excluded.access_expires_at,
       updated_at=CURRENT_TIMESTAMP`
  ).bind(`mem_${crypto.randomUUID()}`, customerId, plan, `manual_${crypto.randomUUID()}`, accessExpiresAt).run();

  const magicUrl = await createMagicLink(env, request, email);
  const sent = await sendMagicEmail(env, email, magicUrl);

  return json({
    ok: true,
    email,
    plan,
    access_expires_at: accessExpiresAt,
    sent,
    magic_url: sent ? undefined : magicUrl,
  });
};

async function createMagicLink(env: Env, request: Request, email: string): Promise<string> {
  if (!env.DB) throw new Error('missing-db');
  const token = createOpaqueToken();
  const tokenHash = await sha256(token);
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString();

  await env.DB.prepare(
    `INSERT INTO auth_tokens (id, email, token_hash, redirect_path, expires_at)
     VALUES (?, ?, ?, '/app', ?)`
  ).bind(crypto.randomUUID(), email, tokenHash, expires).run();

  const origin = env.ACADEMY_BASE_URL || new URL(request.url).origin;
  return `${origin.replace(/\/$/, '')}/api/auth?token=${encodeURIComponent(token)}`;
}

async function sendMagicEmail(env: Env, email: string, magicUrl: string): Promise<boolean> {
  if (!env.RESEND_API_KEY) return false;
  const response = await fetch('https://api.resend.com/emails', {
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
        <p style="color:#3f3f46;line-height:1.55">Kliknij link, żeby wejść do panelu z odcinkami, vaultem i materiałami wdrożeniowymi.</p>
        <p><a href="${escapeAttr(magicUrl)}" style="display:inline-block;background:#ff7a1c;color:#0a0a0c;padding:12px 18px;border-radius:10px;font-weight:700;text-decoration:none">Otwórz panel</a></p>
        <p style="font-size:12px;color:#71717a">Link działa 48 godzin i jest jednorazowy.</p>
      </div>`,
    }),
  });
  return response.ok;
}

function addMonthsIso(date: Date, months: number): string {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next.toISOString();
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
