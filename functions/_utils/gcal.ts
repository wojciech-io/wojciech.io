// Google Calendar integration for the /meet scheduler.
//
// Auth: a single long-lived OAuth refresh token (owner's personal Gmail),
// exchanged for a short-lived access token per request. This is the only
// workable model for a personal @gmail.com account (service-account
// domain-delegation needs Workspace).
//
// Everything is gated on isConfigured(): until the three secrets exist the
// booking flow still records the row and emails the .ics, it just skips the
// live calendar write and free/busy check. That lets the endpoint ship before
// the Google project is provisioned.

export interface GcalEnv {
  GCAL_CLIENT_ID?: string;
  GCAL_CLIENT_SECRET?: string;
  GCAL_REFRESH_TOKEN?: string;
}

export interface BusyInterval {
  start: string; // ISO
  end: string; // ISO
}

export interface GcalEventInput {
  summary: string;
  description?: string;
  startUtcIso: string;
  endUtcIso: string;
  timeZone: string;
  attendees: { email: string; displayName?: string }[];
}

export function isConfigured(env: GcalEnv): boolean {
  return Boolean(env.GCAL_CLIENT_ID && env.GCAL_CLIENT_SECRET && env.GCAL_REFRESH_TOKEN);
}

async function getAccessToken(env: GcalEnv): Promise<string> {
  const body = new URLSearchParams({
    client_id: env.GCAL_CLIENT_ID!,
    client_secret: env.GCAL_CLIENT_SECRET!,
    refresh_token: env.GCAL_REFRESH_TOKEN!,
    grant_type: 'refresh_token',
  });
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`gcal token exchange failed (${res.status}): ${detail.slice(0, 200)}`);
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('gcal token exchange returned no access_token');
  return data.access_token;
}

/** Busy intervals across the given calendars in [timeMin, timeMax). */
export async function queryFreeBusy(
  env: GcalEnv,
  calendarIds: string[],
  timeMinIso: string,
  timeMaxIso: string
): Promise<BusyInterval[]> {
  const token = await getAccessToken(env);
  const res = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      timeMin: timeMinIso,
      timeMax: timeMaxIso,
      items: calendarIds.map((id) => ({ id })),
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`gcal freeBusy failed (${res.status}): ${detail.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    calendars?: Record<string, { busy?: BusyInterval[] }>;
  };
  const out: BusyInterval[] = [];
  for (const cal of Object.values(data.calendars ?? {})) {
    for (const b of cal.busy ?? []) out.push(b);
  }
  return out;
}

/** Create the event and invite attendees. Returns the event id. */
export async function insertEvent(
  env: GcalEnv,
  calendarId: string,
  ev: GcalEventInput
): Promise<string> {
  const token = await getAccessToken(env);
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=all`,
    {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        summary: ev.summary,
        description: ev.description,
        start: { dateTime: ev.startUtcIso, timeZone: ev.timeZone },
        end: { dateTime: ev.endUtcIso, timeZone: ev.timeZone },
        attendees: ev.attendees.map((a) => ({ email: a.email, displayName: a.displayName })),
        reminders: { useDefault: true },
      }),
    }
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`gcal event insert failed (${res.status}): ${detail.slice(0, 200)}`);
  }
  const data = (await res.json()) as { id?: string };
  if (!data.id) throw new Error('gcal event insert returned no id');
  return data.id;
}
