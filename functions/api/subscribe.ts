interface PagesFunctionContext {
  request: Request;
  env: {
    SUBSCRIBE_API_URL?: string;
    RESEND_API_KEY?: string;
    RESEND_SEGMENT_ID?: string;
    RESEND_TOPIC_ID?: string;
  };
}

interface SubscribePayload {
  email?: string;
  name?: string;
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
  const name = payload.name?.trim() || '';

  if (!email || !emailPattern.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
  }

  if (env.SUBSCRIBE_API_URL) {
    return proxySubscribe(env.SUBSCRIBE_API_URL, { email, name });
  }

  if (!env.RESEND_API_KEY) {
    return json(
      {
        ok: false,
        error: 'Subscription endpoint is not configured.',
      },
      { status: 503 }
    );
  }

  return createResendContact(env, { email, name });
}

async function proxySubscribe(subscribeApiUrl: string, payload: Required<SubscribePayload>) {
  const response = await fetch(subscribeApiUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: payload.email,
      name: payload.name,
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

async function createResendContact(
  env: Pick<PagesFunctionContext['env'], 'RESEND_API_KEY' | 'RESEND_SEGMENT_ID' | 'RESEND_TOPIC_ID'>,
  payload: Required<SubscribePayload>
) {
  const [firstName, ...lastNameParts] = payload.name.split(/\s+/).filter(Boolean);
  const body: Record<string, unknown> = {
    email: payload.email,
    unsubscribed: false,
  };

  if (firstName) {
    body.firstName = firstName;
  }

  if (lastNameParts.length > 0) {
    body.lastName = lastNameParts.join(' ');
  }

  if (env.RESEND_SEGMENT_ID) {
    body.segments = [{ id: env.RESEND_SEGMENT_ID }];
  }

  if (env.RESEND_TOPIC_ID) {
    body.topics = [{ id: env.RESEND_TOPIC_ID, subscription: 'opt_in' }];
  }

  try {
    const response = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 409) {
        return json({ ok: true, already: true });
      }

      const data = await response.json().catch(() => null);
      return json(
        {
          ok: false,
          error: data?.message || data?.error || 'Subscription is not available right now. Please try again later.',
        },
        { status: 502 }
      );
    }

    return json({ ok: true, already: false });
  } catch {
    return json(
      {
        ok: false,
        error: 'Subscription is not available right now. Please try again later.',
      },
      { status: 502 }
    );
  }
}

export function onRequestGet() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405 });
}
