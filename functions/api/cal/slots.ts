const CAL_USERNAME = 'wojciech-luszczynski';
const EVENT_TYPE_SLUG = '30min';
const EVENT_DURATION_MINUTES = 30;
const CAL_TIMEZONE = 'Europe/Berlin';
const CAL_API_VERSION = '2024-09-04';
const FALLBACK_CAL_LINK = `https://cal.com/${CAL_USERNAME}/${EVENT_TYPE_SLUG}?timezone=${encodeURIComponent(CAL_TIMEZONE)}`;

interface PagesFunctionContext {
  request: Request;
  env: {
    CAL_API_KEY?: string;
  };
}

interface CalSlot {
  start?: string;
  end?: string;
}

interface CalSlotsPayload {
  data?: Record<string, CalSlot[]>;
}

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=60, stale-while-revalidate=180',
      ...init.headers,
    },
  });
}

function dateKeyInBerlin(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: CAL_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const get = (type: string) => parts.find((part) => part.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function isDateKey(value: string | null) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function fallback(start: string, end: string, status = 200) {
  return json(
    {
      status: 'fallback',
      timezone: CAL_TIMEZONE,
      start,
      end,
      directLink: FALLBACK_CAL_LINK,
      days: [],
    },
    { status }
  );
}

export async function onRequestGet({ request, env }: PagesFunctionContext) {
  const requestUrl = new URL(request.url);
  const today = new Date();
  const start = isDateKey(requestUrl.searchParams.get('start'))
    ? requestUrl.searchParams.get('start')!
    : dateKeyInBerlin(today);
  const end = isDateKey(requestUrl.searchParams.get('end'))
    ? requestUrl.searchParams.get('end')!
    : dateKeyInBerlin(addDays(today, 14));

  if (!env.CAL_API_KEY) {
    return fallback(start, end);
  }

  const url = new URL('https://api.cal.com/v2/slots');
  url.searchParams.set('eventTypeSlug', EVENT_TYPE_SLUG);
  url.searchParams.set('username', CAL_USERNAME);
  url.searchParams.set('start', start);
  url.searchParams.set('end', end);
  url.searchParams.set('timeZone', CAL_TIMEZONE);
  url.searchParams.set('duration', String(EVENT_DURATION_MINUTES));
  url.searchParams.set('format', 'range');

  try {
    const response = await fetch(url, {
      headers: {
        authorization: `Bearer ${env.CAL_API_KEY}`,
        'cal-api-version': CAL_API_VERSION,
      },
    });

    if (!response.ok) {
      return fallback(start, end);
    }

    const payload = (await response.json()) as CalSlotsPayload;
    const days = Object.entries(payload.data ?? {}).map(([date, slots]) => ({
      date,
      slots: slots
        .filter((slot) => slot.start)
        .map((slot) => ({
          start: slot.start,
          end: slot.end,
        })),
    }));

    return json({
      status: 'success',
      timezone: CAL_TIMEZONE,
      start,
      end,
      directLink: FALLBACK_CAL_LINK,
      days,
    });
  } catch {
    return fallback(start, end);
  }
}
