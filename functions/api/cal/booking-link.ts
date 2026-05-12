const CAL_USERNAME = 'wojciech-luszczynski';
const PREFERRED_DURATION_MINUTES = 30;
const FALLBACK_CAL_LINK = `${CAL_USERNAME}/30min`;

interface PagesFunctionContext {
  env: {
    CAL_API_KEY?: string;
  };
}

interface CalEventType {
  slug?: string;
  title?: string;
  lengthInMinutes?: number;
  hidden?: boolean;
}

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300, stale-while-revalidate=3600',
      ...init.headers,
    },
  });
}

function chooseEventType(eventTypes: CalEventType[]) {
  const visible = eventTypes.filter((eventType) => !eventType.hidden && eventType.slug);
  return (
    visible.find((eventType) => eventType.lengthInMinutes === PREFERRED_DURATION_MINUTES) ??
    visible.find((eventType) => eventType.slug === '30min') ??
    visible[0]
  );
}

export async function onRequestGet({ env }: PagesFunctionContext) {
  if (!env.CAL_API_KEY) {
    return json({
      calLink: FALLBACK_CAL_LINK,
      source: 'fallback',
    });
  }

  const url = new URL('https://api.cal.com/v2/event-types');
  url.searchParams.set('username', CAL_USERNAME);
  url.searchParams.set('sortCreatedAt', 'asc');

  try {
    const response = await fetch(url, {
      headers: {
        authorization: `Bearer ${env.CAL_API_KEY}`,
        'cal-api-version': '2024-06-14',
      },
    });

    if (!response.ok) {
      return json(
        {
          calLink: FALLBACK_CAL_LINK,
          source: 'fallback',
        },
        { status: 200 }
      );
    }

    const payload = (await response.json()) as { data?: CalEventType[] };
    const eventType = chooseEventType(payload.data ?? []);

    return json({
      calLink: eventType?.slug ? `${CAL_USERNAME}/${eventType.slug}` : FALLBACK_CAL_LINK,
      source: eventType?.slug ? 'cal-api' : 'fallback',
    });
  } catch {
    return json({
      calLink: FALLBACK_CAL_LINK,
      source: 'fallback',
    });
  }
}
