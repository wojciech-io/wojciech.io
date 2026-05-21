import { createOpaqueToken, sha256, signSession } from '../_utils/crypto';
import { clientIp, rateLimit } from '../_utils/ratelimit';

interface Env {
  DB?: D1Database;
  AUTH_SECRET?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  RATE_LIMIT?: KVNamespace;
  AUTH_DEBUG_LINKS?: string;
}

const COOKIE_NAME = 'academy_auth';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const rl = await rateLimit(env.RATE_LIMIT, `academy-auth:${clientIp(request)}`, 8, 600);
  if (!rl.ok) return rl.response!;

  if (!env.DB || !env.AUTH_SECRET) {
    return json({ ok: false, error: 'auth-not-configured' }, 500);
  }

  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch {}
  const email = String(body.email || '').trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return json({ ok: false, error: 'invalid-email' }, 400);

  const member = await activeMember(env.DB, email);
  if (!member) {
    return json({ ok: false, error: 'not-a-member' }, 404);
  }

  const token = createOpaqueToken();
  const tokenHash = await sha256(token);
  const expires = new Date(Date.now() + 1000 * 60 * 30).toISOString();
  const next = String(body.next || '/app');

  await env.DB.prepare(
    `INSERT INTO auth_tokens (id, email, token_hash, redirect_path, expires_at)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(crypto.randomUUID(), email, tokenHash, next.startsWith('/app') ? next : '/app', expires).run();

  const url = new URL(request.url);
  const magicUrl = `${url.origin}/api/auth?token=${encodeURIComponent(token)}`;
  await sendMagicLink(env, email, magicUrl);

  return json({
    ok: true,
    sent: Boolean(env.RESEND_API_KEY),
    debug_link: env.AUTH_DEBUG_LINKS === 'true' ? magicUrl : undefined,
  });
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB || !env.AUTH_SECRET) {
    return new Response('Auth not configured', { status: 500 });
  }

  const url = new URL(request.url);
  const token = url.searchParams.get('token') || '';
  if (!token) return new Response('Missing token', { status: 400 });

  const tokenHash = await sha256(token);
  const row = await env.DB.prepare(
    `SELECT id, email, redirect_path, expires_at, consumed_at
     FROM auth_tokens
     WHERE token_hash = ?
     LIMIT 1`
  ).bind(tokenHash).first<{ id: string; email: string; redirect_path: string; expires_at: string; consumed_at: string | null }>();

  if (!row || row.consumed_at || Date.parse(row.expires_at) < Date.now()) {
    return new Response('Link wygasł albo został już użyty.', { status: 401 });
  }

  const member = await activeMember(env.DB, row.email);
  if (!member) return new Response('Brak aktywnego dostępu.', { status: 403 });

  await env.DB.prepare('UPDATE auth_tokens SET consumed_at = CURRENT_TIMESTAMP WHERE id = ?').bind(row.id).run();
  const session = await signSession(
    { sub: member.customer_id, email: row.email, plan: member.plan },
    env.AUTH_SECRET,
  );

  const redirect = row.redirect_path && row.redirect_path.startsWith('/app') ? row.redirect_path : '/app';
  return new Response(null, {
    status: 302,
    headers: {
      Location: redirect,
      'Set-Cookie': `${COOKIE_NAME}=${encodeURIComponent(session)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 30}`,
    },
  });
};

export const onRequestDelete: PagesFunction = async () => {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
    },
  });
};

async function activeMember(db: D1Database, email: string): Promise<{ customer_id: string; plan: string } | null> {
  return db.prepare(
    `SELECT c.id AS customer_id, m.plan
     FROM customers c
     JOIN memberships m ON m.customer_id = c.id
     WHERE c.email = ? AND m.status IN ('active', 'trialing')
     ORDER BY m.created_at DESC
     LIMIT 1`
  ).bind(email).first<{ customer_id: string; plan: string }>();
}

async function sendMagicLink(env: Env, email: string, magicUrl: string): Promise<void> {
  if (!env.RESEND_API_KEY) return;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM || 'AI Growth OS <hello@academy.wojciech.io>',
      to: email,
      subject: 'Link do AI Growth OS Academy',
      html: `<div style="font-family:-apple-system,system-ui,sans-serif;max-width:560px">
        <h2 style="margin:0 0 12px;color:#0a0a0a">Wejście do Academy</h2>
        <p style="color:#3f3f46;line-height:1.55">Kliknij poniższy link, żeby wejść do panelu. Link działa 30 minut i jest jednorazowy.</p>
        <p><a href="${escapeAttr(magicUrl)}" style="display:inline-block;background:#ff7a1c;color:#0a0a0c;padding:12px 18px;border-radius:10px;font-weight:700;text-decoration:none">Otwórz panel</a></p>
        <p style="font-size:12px;color:#71717a">Jeśli to nie Ty, zignoruj ten email.</p>
      </div>`,
    }),
  });
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
