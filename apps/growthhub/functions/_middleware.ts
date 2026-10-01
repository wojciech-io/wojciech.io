// CF Pages Functions middleware for gh.wojciech.io (GrowthHub).
// Gates everything except /demo (public demo with synthetic data) and
// the auth/login surface. Mirrors the pattern used by app.wojciech.io.

import { verifyToken } from './_utils/crypto';

interface Env {
  APP_PASSWORD: string;
  COOKIE_SECRET: string;
  COOKIE_MAX_AGE_DAYS?: string;
  CRON_SECRET?: string;
  ASSETS: Fetcher;
}

// The cookie name lives in three places and only two of them can share a
// symbol: functions/api/auth.ts sets and clears it by constant, and this file
// reads it with a literal regex, because a pattern built from a variable is
// rejected by the security lint. There used to be an unread COOKIE_NAME here
// as well, which only looked like it kept the two in step. Renaming the cookie
// means editing api/auth.ts and the literal below.
const COOKIE_RX = /(?:^|;\s*)wapp_auth=([^;]+)/;

function isGatedHost(hostname: string): boolean {
  if (hostname === 'gh.wojciech.io') return true;
  if (hostname === 'gh-wojciech-io.pages.dev') return true;
  if (hostname.endsWith('.gh-wojciech-io.pages.dev')) return true;
  return false;
}

const ALLOWED_EXACT = [
  '/api/auth',
  '/login',
  '/login.html',
  '/favicon.ico',
  '/favicon.svg',
  '/favicon-32x32.png',
  '/favicon-512x512.png',
  '/apple-touch-icon.png',
  '/wojciech-avatar.webp',
  '/robots.txt',
  '/llms.txt',
  '/og-default.png',
];

function isAllowed(pathname: string): boolean {
  if (ALLOWED_EXACT.includes(pathname)) return true;
  // Content-hashed, immutable build assets (CSS/JS/fonts). Public by design —
  // they carry no gated data, and the public /demo page needs them to render.
  // Gating these left /demo unstyled (assets 302'd to /login).
  if (pathname.startsWith('/_astro/')) return true;
  if (pathname === '/demo' || pathname.startsWith('/demo/')) return true;
  return false;
}

async function isAuthenticated(request: Request, env: Env): Promise<boolean> {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(COOKIE_RX);
  if (!match) return false;
  // Enforce server-side token expiry (defaults to 30 days). Without the
  // maxAgeMs arg the age check silently passes (compares against undefined),
  // so a leaked cookie value would be replayable forever.
  const maxAgeDays = Math.max(1, parseInt(env.COOKIE_MAX_AGE_DAYS || '30', 10));
  const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
  try {
    return await verifyToken(decodeURIComponent(match[1]), env.COOKIE_SECRET, maxAgeMs);
  } catch {
    return false;
  }
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const { request, env, next } = ctx;
  const url = new URL(request.url);

  if (!isGatedHost(url.hostname)) {
    return next();
  }

  if (isAllowed(url.pathname)) {
    return next();
  }

  // Allow cron Worker to hit /api/sync with a shared secret (no cookie).
  if (
    url.pathname === '/api/sync' &&
    request.method === 'POST' &&
    env.CRON_SECRET &&
    request.headers.get('Authorization') === `Bearer ${env.CRON_SECRET}`
  ) {
    return next();
  }

  if (await isAuthenticated(request, env)) {
    return next();
  }

  // Redirect to /login (CF Pages strips .html). The middleware whitelists
  // /login so the redirect target serves login.html content statically.
  return new Response(null, {
    status: 302,
    headers: { Location: '/login' },
  });
};
