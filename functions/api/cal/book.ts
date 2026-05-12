const CAL_USERNAME = 'wojciech-luszczynski';
const EVENT_TYPE_SLUG = '30min';
const EVENT_DURATION_MINUTES = 30;
const CAL_TIMEZONE = 'Europe/Berlin';
const CAL_API_VERSION = '2026-02-25';
const FALLBACK_CAL_LINK = `https://cal.com/${CAL_USERNAME}/${EVENT_TYPE_SLUG}?timezone=${encodeURIComponent(CAL_TIMEZONE)}`;

interface PagesFunctionContext {
  request: Request;
  env: {
    CAL_API_KEY?: string;
  };
}

interface BookingRequestBody {
  start?: unknown;
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
  website?: unknown;
}

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

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidStart(value: string) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return false;

  const now = Date.now();
  const maxFuture = now + 1000 * 60 * 60 * 24 * 90;
  return timestamp > now && timestamp < maxFuture;
}

export async function onRequestPost({ request, env }: PagesFunctionContext) {
  let body: BookingRequestBody;

  try {
    body = (await request.json()) as BookingRequestBody;
  } catch {
    return json({ status: 'error', message: 'Invalid request body.' }, { status: 400 });
  }

  if (cleanText(body.website, 100)) {
    return json({ status: 'ok' }, { status: 200 });
  }

  const start = cleanText(body.start, 80);
  const name = cleanText(body.name, 120);
  const email = cleanText(body.email, 180).toLowerCase();
  const company = cleanText(body.company, 120);
  const message = cleanText(body.message, 500);

  if (!start || !isValidStart(start)) {
    return json({ status: 'error', message: 'Pick a valid future slot.' }, { status: 400 });
  }

  if (!name || !isEmail(email)) {
    return json({ status: 'error', message: 'Name and valid email are required.' }, { status: 400 });
  }

  if (!env.CAL_API_KEY) {
    return json(
      {
        status: 'fallback',
        message: 'Booking API is not configured.',
        directLink: FALLBACK_CAL_LINK,
      },
      { status: 503 }
    );
  }

  try {
    const response = await fetch('https://api.cal.com/v2/bookings', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.CAL_API_KEY}`,
        'cal-api-version': CAL_API_VERSION,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        start: new Date(start).toISOString(),
        attendee: {
          name,
          email,
          timeZone: CAL_TIMEZONE,
          language: 'en',
        },
        eventTypeSlug: EVENT_TYPE_SLUG,
        username: CAL_USERNAME,
        lengthInMinutes: EVENT_DURATION_MINUTES,
        metadata: {
          source: 'wojciech.io',
          company,
          message,
        },
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return json(
        {
          status: 'error',
          message: 'Cal.com rejected this booking.',
          directLink: FALLBACK_CAL_LINK,
          details: payload,
        },
        { status: response.status }
      );
    }

    return json({
      status: 'success',
      booking: payload,
    });
  } catch {
    return json(
      {
        status: 'error',
        message: 'Could not reach Cal.com.',
        directLink: FALLBACK_CAL_LINK,
      },
      { status: 502 }
    );
  }
}
