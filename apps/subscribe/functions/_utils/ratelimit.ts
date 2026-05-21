// Fixed-window rate limiter backed by Workers KV. Defense-in-depth — sits
// alongside (not instead of) any Cloudflare WAF rate-limiting rule.
//
// Usage in a Pages Function:
//   const rl = await rateLimit(env.RATE_LIMIT, `auth:${clientIp(request)}`, 10, 60);
//   if (!rl.ok) return rl.response;
//
// If the KV binding is absent, the limiter fails OPEN (allows the request)
// so a missing binding never takes the endpoint down.

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  response?: Response;
}

export function clientIp(request: Request): string {
  return request.headers.get('CF-Connecting-IP')
    || request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim()
    || 'unknown';
}

export async function rateLimit(
  kv: KVNamespace | undefined,
  scopeKey: string,
  limit: number,
  windowSec: number,
): Promise<RateLimitResult> {
  if (!kv) return { ok: true, remaining: limit };

  const bucket = Math.floor(Date.now() / 1000 / windowSec);
  const key = `rl:${scopeKey}:${bucket}`;

  const current = parseInt((await kv.get(key)) || '0', 10);
  if (current >= limit) {
    return {
      ok: false,
      remaining: 0,
      response: new Response(
        JSON.stringify({ ok: false, error: 'rate-limited', retry_after_s: windowSec }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(windowSec),
            'Cache-Control': 'no-store',
          },
        },
      ),
    };
  }

  // Increment. TTL slightly longer than the window so the bucket self-expires.
  await kv.put(key, String(current + 1), { expirationTtl: windowSec + 5 });
  return { ok: true, remaining: limit - current - 1 };
}
