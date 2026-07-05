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
  /** Attach a Google Meet conference and return its join link. */
  withMeet?: boolean;
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
  calendarIds: readonly string[],
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

/**
 * Create the event and invite attendees. Returns the event id and, when
 * `withMeet` is set, the Google Meet join link. `sendUpdates=all` makes Google
 * email the attendees a native invite (the rich RSVP card in Gmail).
 */
export async function insertEvent(
  env: GcalEnv,
  calendarId: string,
  ev: GcalEventInput
): Promise<{ id: string; meetUrl?: string }> {
  const token = await getAccessToken(env);
  const body: Record<string, unknown> = {
    summary: ev.summary,
    description: ev.description,
    start: { dateTime: ev.startUtcIso, timeZone: ev.timeZone },
    end: { dateTime: ev.endUtcIso, timeZone: ev.timeZone },
    attendees: ev.attendees.map((a) => ({ email: a.email, displayName: a.displayName })),
    reminders: { useDefault: true },
  };
  if (ev.withMeet) {
    // A createRequest with a unique id asks Google to provision a Meet link.
    body.conferenceData = {
      createRequest: {
        requestId: `meet-${ev.startUtcIso}-${ev.attendees[0]?.email ?? 'guest'}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    };
  }
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=all${
      ev.withMeet ? '&conferenceDataVersion=1' : ''
    }`,
    {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`gcal event insert failed (${res.status}): ${detail.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    id?: string;
    hangoutLink?: string;
    conferenceData?: { entryPoints?: { entryPointType?: string; uri?: string }[] };
  };
  if (!data.id) throw new Error('gcal event insert returned no id');
  const meetUrl =
    data.hangoutLink ??
    data.conferenceData?.entryPoints?.find((e) => e.entryPointType === 'video')?.uri;
  return { id: data.id, meetUrl };
}

/**
 * Delete an event by id and notify attendees (sendUpdates=all). Idempotent:
 * a 404/410 (already gone) is treated as success so a retried cancel is safe.
 */
export async function deleteEvent(
  env: GcalEnv,
  calendarId: string,
  eventId: string
): Promise<void> {
  const token = await getAccessToken(env);
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}?sendUpdates=all`,
    { method: 'DELETE', headers: { authorization: `Bearer ${token}` } }
  );
  if (!res.ok && res.status !== 404 && res.status !== 410) {
    const detail = await res.text().catch(() => '');
    throw new Error(`gcal event delete failed (${res.status}): ${detail.slice(0, 200)}`);
  }
}
