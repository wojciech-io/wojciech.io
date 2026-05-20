// CF Pages Functions middleware for gh.wojciech.io (GrowthHub).
// Gates everything except /demo (public demo with synthetic data) and
// the auth/login surface. Mirrors the pattern used by app.wojciech.io.

import { verifyToken } from './_utils/crypto';

interface Env {
  APP_PASSWORD: string;
  COOKIE_SECRET: string;
  COOKIE_MAX_AGE_DAYS?: string;
  ASSETS: Fetcher;
}

const COOKIE_NAME = 'wapp_auth';

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
  '/wojciech-photo.png',
  '/robots.txt',
  '/llms.txt',
  '/og-default.png',
];

function isAllowed(pathname: string): boolean {
  if (ALLOWED_EXACT.includes(pathname)) return true;
  if (pathname === '/demo' || pathname.startsWith('/demo/')) return true;
  return false;
}

async function isAuthenticated(request: Request, env: Env): Promise<boolean> {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  if (!match) return false;
  try {
    return await verifyToken(decodeURIComponent(match[1]), env.COOKIE_SECRET);
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
