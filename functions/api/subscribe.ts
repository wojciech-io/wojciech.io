const DEFAULT_SUBSCRIBE_API_URL = 'https://subscribe-wojciech.vercel.app/api/subscribe';

interface PagesFunctionContext {
  request: Request;
  env: {
    SUBSCRIBE_API_URL?: string;
  };
}

interface SubscribePayload {
  email?: string;
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
  let payload: SubscribePayload;

  try {
    payload = (await request.json()) as SubscribePayload;
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase();

  if (!email || !emailPattern.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const subscribeApiUrl = env.SUBSCRIBE_API_URL || DEFAULT_SUBSCRIBE_API_URL;
  return proxySubscribe(subscribeApiUrl, { email });
}

async function proxySubscribe(subscribeApiUrl: string, payload: Required<SubscribePayload>) {
  const response = await fetch(subscribeApiUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: payload.email,
      newsletter: true,
      source: 'wojciech.io/subscribe',
    }),
  });

  const data = await response.json().catch(() => null);

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
