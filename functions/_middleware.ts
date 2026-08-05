// Cloudflare Pages Functions middleware — gates every request behind the auth cookie
// ONLY for app.wojciech.io traffic. Same functions/ directory is deployed by both
// wojciech.io and app-wojciech-io CF Pages projects; we discriminate by hostname so
// public wojciech.io traffic always passes through with security headers.

import { verifyToken } from './_utils/crypto';

interface Env {
  APP_PASSWORD: string;
  COOKIE_SECRET: string;
  COOKIE_MAX_AGE_DAYS?: string;
  ASSETS: Fetcher;
}

const COOKIE_NAME = 'wapp_auth';

// Hostnames that should be gated. Anything else (wojciech.io, *.wojciech-io.pages.dev,
// preview deploys of the public site, custom localhost dev) passes through untouched.
function isGatedHost(hostname: string): boolean {
  if (hostname === 'app.wojciech.io') return true;
  if (hostname === 'app-wojciech-io.pages.dev') return true;
  if (hostname.endsWith('.app-wojciech-io.pages.dev')) return true;
  return false;
}

// Paths that bypass auth check (even on gated hosts).
const ALLOWED = [
  '/api/auth',
  '/login.html',
  '/favicon.ico',
  '/favicon.svg',
  '/favicon-32x32.png',
  '/favicon-512x512.png',
  '/apple-touch-icon.png',
  '/wojciech-avatar.webp',
  '/robots.txt',
  '/llms.txt',
  '/bimi.svg',
  '/og-default.png',
  '/manifest.json',
];

// Security headers applied to every wojciech.io response.
// PostHog uses EU endpoints (eu.i.posthog.com). Sentry tunnel not used on public site.
export const PUBLIC_SECURITY_HEADERS: Record<string, string> = {
  'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'cross-origin-opener-policy': 'same-origin-allow-popups',
  'cross-origin-resource-policy': 'same-origin',
  'cross-origin-embedder-policy': 'unsafe-none',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=(), payment=()',
  // CSP: keep in sync with public/_headers. Middleware wins over Pages _headers
  // whenever Pages Functions run on the public site.
  // unsafe-inline required for Astro's is:inline scripts and Tailwind utilities.
  // gh.wojciech.io is for LiveEmbed demos.
  'content-security-policy': [
    "default-src 'self'",
    // wasm-unsafe-eval: Pagefind search compiles a WebAssembly module at runtime.
    // app.cal.com: embedded scheduler (inline on contact, popup on booking CTAs)
    "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com https://eu-assets.i.posthog.com https://app.cal.com",
    "style-src 'self' 'unsafe-inline'",
    // cdn.simpleicons.org: tech-logo chips on the /stack overview page
    "img-src 'self' data: https://www.gravatar.com https://img.youtube.com https://i.ytimg.com https://cdn.simpleicons.org https://app.cal.com https://cal.com",
    // *.google-analytics.com, not just www: GA4 sends hits to a regional
    // endpoint (region1.google-analytics.com for EU traffic, other regionN
    // elsewhere). Listing only www silently blocked every hit at connect-src.
    "connect-src 'self' https://*.google-analytics.com https://analytics.google.com https://cloudflareinsights.com https://o4511411558678528.ingest.de.sentry.io https://eu.i.posthog.com https://eu-assets.i.posthog.com https://app.cal.com",
    "font-src 'self'",
    // worker-src: pagefind search uses web workers served from same origin
    "worker-src 'self'",
    // manifest-src: webmanifest served from same origin
    "manifest-src 'self'",
    "frame-src https://gh.wojciech.io https://app.cal.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join('; '),
};

function applySecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(PUBLIC_SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, { status: response.status, headers });
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const { request, env, next } = ctx;
  const url = new URL(request.url);

  // Uptime probe — single endpoint that always returns 200 OK, on every host,
  // before any locale/auth logic runs. Lets BetterStack monitor app.wojciech.io
  // (which is auth-gated) without the gate flapping the check.
  // No body details so we don't leak commit/host metadata to public scanners.
  if (url.pathname === '/healthz') {
    return new Response('ok\n', {
      status: 200,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'strict-origin-when-cross-origin',
      },
    });
  }

  // Public wojciech.io: pass through with security headers injected.
  // No Accept-Language auto-redirect on `/`: it cost ~850ms per non-English
  // visit and blocked edge caching of the root. Visitors land on the canonical
  // EN page and switch language via the nav. Locale homepages stay at /<locale>/.
  if (!isGatedHost(url.hostname)) {
    const response = await next();
    return applySecurityHeaders(response);
  }

  if (ALLOWED.includes(url.pathname)) {
    return next();
  }

  if (await isAuthenticated(request, env)) {
    return next();
  }

  // Not authenticated — serve login.html from static assets.
  const loginUrl = new URL(request.url);
  loginUrl.pathname = '/login.html';
  const loginResponse = await env.ASSETS.fetch(new Request(loginUrl.toString(), { method: 'GET' }));

  // Return with 401 so it's clear to clients that this is a gate, not the real content.
  // But keep content-type/body from the asset fetch.
  const body = await loginResponse.arrayBuffer();
  return new Response(body, {
    status: 401,
    headers: {
      'content-type': loginResponse.headers.get('content-type') || 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
      'content-security-policy':
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
      'x-frame-options': 'DENY',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'strict-origin-when-cross-origin',
      'cross-origin-opener-policy': 'same-origin',
      'cross-origin-resource-policy': 'same-origin',
      'cross-origin-embedder-policy': 'unsafe-none',
      'permissions-policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=(), payment=()',
    },
  });
};

async function isAuthenticated(request: Request, env: Env): Promise<boolean> {
  if (!env.COOKIE_SECRET) return false;
  const cookieHeader = request.headers.get('cookie') || '';
  const token = parseCookie(cookieHeader, COOKIE_NAME);
  if (!token) return false;

  const maxAgeDays = Math.max(1, parseInt(env.COOKIE_MAX_AGE_DAYS || '30', 10));
  const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
  return verifyToken(token, env.COOKIE_SECRET, maxAgeMs);
}

function parseCookie(header: string, name: string): string | null {
  const parts = header.split(';');
  for (const part of parts) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    const k = part.slice(0, eq).trim();
    if (k === name) return part.slice(eq + 1).trim();
  }
  return null;
}
