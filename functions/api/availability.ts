// GET /api/availability?type=<meeting id>
// Returns bookable UTC slot start times for a meeting type, computed from the
// working-hours rules minus D1 bookings minus Google Calendar busy. The client
// renders them in the visitor's own timezone.

import { BOOKING_RULES, BOOKING_CONTACTS, MEETING_BY_ID } from '../../src/data/booking';
import { generateAvailability, type AvailabilityRules, type BusyInterval } from '../_utils/slots';
import { isConfigured, queryFreeBusy } from '../_utils/gcal';
import { rateLimit, clientIp } from '../_utils/ratelimit';

interface Env {
  DB?: D1Database;
  RATE_LIMIT?: KVNamespace;
  GCAL_CLIENT_ID?: string;
  GCAL_CLIENT_SECRET?: string;
  GCAL_REFRESH_TOKEN?: string;
}

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...init.headers },
  });
}

const rules: AvailabilityRules = { ...BOOKING_RULES, workingDays: [...BOOKING_RULES.workingDays] };

export async function onRequestGet({ request, env }: { request: Request; env: Env }) {
  // Light throttle: availability is read-only but should not be scrapeable at will.
  const rl = await rateLimit(env.RATE_LIMIT, `availability:${clientIp(request)}`, 60, 600);
  if (!rl.ok) return rl.response!;

  const typeId = new URL(request.url).searchParams.get('type') || 'systems';
  const mt = MEETING_BY_ID[typeId];
  if (!mt) return json({ ok: false, error: 'Unknown meeting type.' }, { status: 400 });

  const now = new Date();
  const horizonEndIso = new Date(now.getTime() + rules.horizonDays * 86_400_000).toISOString();
  const busy: BusyInterval[] = [];

  // Existing confirmed bookings block their windows.
  if (env.DB) {
    const rows = await env.DB.prepare(
      "SELECT start_utc, end_utc FROM bookings WHERE status = 'confirmed' AND end_utc > ? AND start_utc < ?"
    )
      .bind(now.toISOString(), horizonEndIso)
      .all<{ start_utc: string; end_utc: string }>();
    for (const r of rows.results ?? []) busy.push({ start: r.start_utc, end: r.end_utc });
  }

  // Owner's real calendar blocks the rest (best-effort: a Google outage should
  // degrade to D1-only availability, not a broken page).
  if (isConfigured(env)) {
    try {
      const gbusy = await queryFreeBusy(env, BOOKING_CONTACTS.freeBusyCalendarIds, now.toISOString(), horizonEndIso);
      busy.push(...gbusy);
    } catch {
      /* fall through with D1-only busy */
    }
  }

  const slots = generateAvailability({ rules, durationMin: mt.minutes, now, busy });
  return json({
    ok: true,
    meetingType: { id: mt.id, name: mt.name, minutes: mt.minutes },
    timezone: rules.ownerTimezone,
    slots,
  });
}

export function onRequestPost() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405 });
}

export function onRequestOptions() {
  return new Response(null, { status: 405, headers: { allow: 'GET', 'cache-control': 'no-store' } });
}
