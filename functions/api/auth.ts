// POST /api/auth — validate password, issue signed cookie.
// Env:
//   APP_PASSWORD  — the password that unlocks the app (plain text).
//   COOKIE_SECRET — secret used to sign auth tokens (32+ random bytes recommended).
//   COOKIE_MAX_AGE_DAYS — optional, defaults to 30.

import { signToken, timingSafeEqualStr } from '../_utils/crypto';
import { rateLimit, clientIp } from '../_utils/ratelimit';

interface Env {
  APP_PASSWORD: string;
  COOKIE_SECRET: string;
  COOKIE_MAX_AGE_DAYS?: string;
  RATE_LIMIT?: KVNamespace;
}

const COOKIE_NAME = 'wapp_auth';

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;

  // Anti-brute-force: 10 password attempts / 10 min / IP. Without this the
  // password gate could be guessed at unlimited speed. Fails open if the KV
  // binding is missing, so configure RATE_LIMIT for this to enforce.
  const rl = await rateLimit(env.RATE_LIMIT, `auth:${clientIp(request)}`, 10, 600);
  if (!rl.ok) return rl.response!;

  let body: { password?: string } = {};
  try { body = await request.json(); } catch { /* keep empty */ }
  const password = (body.password || '').trim();

  if (!password) {
    return jsonResponse({ ok: false, error: 'missing-password' }, 400);
  }
  if (!env.APP_PASSWORD || !env.COOKIE_SECRET) {
    return jsonResponse({ ok: false, error: 'auth-not-configured' }, 500);
  }

  if (!timingSafeEqualStr(password, env.APP_PASSWORD.trim())) {
    return jsonResponse({ ok: false, error: 'invalid-password' }, 401);
  }

  const maxAgeDays = Math.max(1, parseInt(env.COOKIE_MAX_AGE_DAYS || '30', 10));
  const maxAgeSec = maxAgeDays * 24 * 60 * 60;
  const token = await signToken(env.COOKIE_SECRET);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'set-cookie': `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAgeSec}`,
    },
  });
};

// DELETE /api/auth — logout, clear the cookie.
export const onRequestDelete: PagesFunction<Env> = async () => {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'set-cookie': `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
    },
  });
};

function jsonResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
