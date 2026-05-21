import { clientIp, rateLimit } from '../../_utils/ratelimit';

interface Env {
  STRIPE_SECRET_KEY?: string;
  STRIPE_PRICE_INDIVIDUAL?: string;
  STRIPE_PRICE_TEAM?: string;
  STRIPE_PRICE_COHORT?: string;
  STRIPE_COHORT_PAYMENT_LINK?: string;
  ACADEMY_BASE_URL?: string;
  RATE_LIMIT?: KVNamespace;
}

const plans = {
  individual: {
    label: 'AI Growth OS — Individual',
    priceEnv: 'STRIPE_PRICE_INDIVIDUAL',
  },
  team: {
    label: 'AI Growth OS — Team',
    priceEnv: 'STRIPE_PRICE_TEAM',
  },
  cohort: {
    label: 'AI Growth OS — Cohort',
    priceEnv: 'STRIPE_PRICE_COHORT',
    fallbackUnitAmount: 290000,
  },
} as const;

type Plan = keyof typeof plans;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const rl = await rateLimit(env.RATE_LIMIT, `stripe-checkout:${clientIp(request)}`, 10, 600);
  if (!rl.ok) return rl.response!;

  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch {}
  const plan = String(body.plan || 'cohort') as Plan;
  if (!(plan in plans)) return json({ ok: false, error: 'invalid-plan' }, 400);

  const email = String(body.email || '').trim().toLowerCase();
  const name = String(body.name || '').trim();
  if (!/^\S+@\S+\.\S+$/.test(email)) return json({ ok: false, error: 'invalid-email' }, 400);

  if (!env.STRIPE_SECRET_KEY && plan === 'cohort' && env.STRIPE_COHORT_PAYMENT_LINK) {
    return json({
      ok: true,
      mode: 'payment-link',
      url: paymentLinkUrl(env.STRIPE_COHORT_PAYMENT_LINK, email),
    });
  }
  if (!env.STRIPE_SECRET_KEY) {
    return json({ ok: false, error: 'stripe-not-configured' }, 500);
  }

  const url = new URL(request.url);
  const base = (env.ACADEMY_BASE_URL || url.origin).replace(/\/$/, '');
  const cfg = plans[plan];
  const priceId = env[cfg.priceEnv as keyof Env] as string | undefined;

  const params = new URLSearchParams();
  params.set('mode', 'payment');
  params.set('client_reference_id', email);
  params.set('allow_promotion_codes', 'true');
  params.set('invoice_creation[enabled]', 'true');
  params.set('success_url', `${base}/thanks?session_id={CHECKOUT_SESSION_ID}`);
  params.set('cancel_url', `${base}/${plan === 'cohort' ? 'cohort' : 'pricing'}?checkout=cancelled`);
  params.set('metadata[plan]', plan);
  params.set('metadata[source]', 'academy-v2');
  params.set('metadata[email]', email);
  if (email) params.set('customer_email', email);
  if (name) params.set('metadata[name]', name);

  if (priceId) {
    params.set('line_items[0][price]', priceId);
    params.set('line_items[0][quantity]', '1');
  } else if (plan === 'cohort') {
    params.set('line_items[0][price_data][currency]', 'pln');
    params.set('line_items[0][price_data][unit_amount]', String(plans.cohort.fallbackUnitAmount));
    params.set('line_items[0][price_data][product_data][name]', cfg.label);
    params.set('line_items[0][quantity]', '1');
  } else {
    return json({ ok: false, error: 'price-not-configured' }, 500);
  }

  const stripe = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  const payload = await stripe.json() as { id?: string; url?: string; error?: { message?: string } };
  if (!stripe.ok || !payload.url) {
    return json({ ok: false, error: 'stripe-checkout-failed', detail: payload.error?.message || 'unknown' }, 502);
  }

  return json({ ok: true, id: payload.id, url: payload.url });
};

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function paymentLinkUrl(rawUrl: string, email: string): string {
  try {
    const url = new URL(rawUrl);
    url.searchParams.set('prefilled_email', email);
    url.searchParams.set('client_reference_id', email);
    return url.toString();
  } catch {
    return rawUrl;
  }
}
