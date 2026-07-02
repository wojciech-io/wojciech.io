// The maintained double-opt-in app (apps/subscribe, KV + Resend). The previous
// default pointed at a legacy Vercel deployment nothing maintains anymore.
const DEFAULT_SUBSCRIBE_API_URL = 'https://subscribe.wojciech.io/api/subscribe';

import { rateLimit, clientIp } from '../_utils/ratelimit';

interface PagesFunctionContext {
  request: Request;
  env: {
    SUBSCRIBE_API_URL?: string;
    RATE_LIMIT?: KVNamespace;
  };
}

interface SubscribePayload {
  email?: string;
  consent?: boolean;
  website?: string;
  elapsed?: number;
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
  // Anti-abuse: 5 signups / 10 min / IP, mirroring the downstream app's limit
  // so abusive traffic stops here instead of consuming the proxy hop.
  const rl = await rateLimit(env.RATE_LIMIT, `subscribe:${clientIp(request)}`, 5, 600);
  if (!rl.ok) return rl.response!;

  let payload: SubscribePayload;

  try {
    payload = (await request.json()) as SubscribePayload;
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase();

  if (!email || email.length > 254 || !emailPattern.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
  }

  // Bot filters. Honeypot filled or the form submitted faster than a person
  // can type an email: answer with a fake success so scripts learn nothing,
  // and never touch Resend quota.
  if (payload.website || (typeof payload.elapsed === 'number' && payload.elapsed < 2000)) {
    return json({ ok: true });
  }

  // GDPR: the newsletter consent checkbox is mandatory. Enforced server-side
  // so a crafted request cannot subscribe anyone without it.
  if (payload.consent !== true) {
    return json({ ok: false, error: 'Consent is required to subscribe.' }, { status: 400 });
  }

  const subscribeApiUrl = env.SUBSCRIBE_API_URL || DEFAULT_SUBSCRIBE_API_URL;
  return proxySubscribe(subscribeApiUrl, { email });
}

async function proxySubscribe(subscribeApiUrl: string, payload: { email: string }) {
  const response = await fetch(subscribeApiUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      // Workers fetch sends no User-Agent; the zone-level scanner guard 403s
      // curl-style or empty agents, so identify as a regular client.
      'user-agent': 'Mozilla/5.0 (compatible; wojciech.io-subscribe-proxy)',
    },
    body: JSON.stringify({
      email: payload.email,
      newsletter: true,
      consent: true,
      source: 'wojciech.io/subscribe',
    }),
  });

  const data = (await response.json().catch(() => null)) as Record<string, unknown> | null;

  if (!response.ok) {
    return json(
      {
        ok: false,
        error: data?.error || 'Subscription is not available right now. Please try again later.',
      },
      { status: response.status }
    );
  }

  return json(data || { ok: true, already: false });
}

export function onRequestGet() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405 });
}

// Explicit handler so Cloudflare Pages does not answer preflight with a permissive
// Access-Control-Allow-Origin: *. This endpoint is same-origin only; no CORS needed.
export function onRequestOptions() {
  return new Response(null, { status: 405, headers: { allow: 'POST', 'cache-control': 'no-store' } });
}
