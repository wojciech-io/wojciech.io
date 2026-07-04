// /api/cancel — manage an existing booking via a signed link from the
// confirmation email (`/meet/cancel?id=<id>&token=<cancel_token>`).
//
// GET  = read-only preview (safe for email link-scanners / prefetch).
// POST = actually cancel (behind a button click), sets status='cancelled'
//        and deletes the Google Calendar event (best-effort; sendUpdates=all
//        notifies the attendees, so no separate cancellation email is needed).
//
// Both are gated on the per-booking cancel_token; a wrong/absent token is
// indistinguishable from "not found" so booking ids can't be enumerated.

import { MEETING_BY_ID, BOOKING_CONTACTS } from '../../src/data/booking';
import { isConfigured, deleteEvent } from '../_utils/gcal';
import { rateLimit, clientIp } from '../_utils/ratelimit';

interface Env {
  DB?: D1Database;
  RATE_LIMIT?: KVNamespace;
  GCAL_CLIENT_ID?: string;
  GCAL_CLIENT_SECRET?: string;
  GCAL_REFRESH_TOKEN?: string;
}

interface BookingRow {
  meeting_type: string;
  duration_min: number;
  start_utc: string;
  status: string;
  cancel_token: string;
  gcal_event_id: string | null;
}

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...init.headers },
  });
}

/** Token-gated lookup. Returns null for missing DB, bad input, or wrong token. */
async function lookup(env: Env, id: string, token: string): Promise<BookingRow | null> {
  if (!env.DB || !id || !token) return null;
  const row = await env.DB.prepare(
    'SELECT meeting_type, duration_min, start_utc, status, cancel_token, gcal_event_id FROM bookings WHERE id = ?'
  )
    .bind(id)
    .first<BookingRow>();
  if (!row || row.cancel_token !== token) return null;
  return row;
}

function summary(row: BookingRow) {
  const mt = MEETING_BY_ID[row.meeting_type];
  return {
    name: mt?.name ?? row.meeting_type,
    minutes: mt?.minutes ?? row.duration_min,
    start: row.start_utc,
    status: row.status,
  };
}

export async function onRequestGet({ request, env }: { request: Request; env: Env }) {
  const url = new URL(request.url);
  const row = await lookup(env, url.searchParams.get('id') || '', url.searchParams.get('token') || '');
  if (!row) return json({ ok: false, error: 'Booking not found.' }, { status: 404 });
  return json({ ok: true, booking: summary(row) });
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  const rl = await rateLimit(env.RATE_LIMIT, `cancel:${clientIp(request)}`, 10, 600);
  if (!rl.ok) return rl.response!;

  let body: { id?: string; token?: string };
  try {
    body = (await request.json()) as { id?: string; token?: string };
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }
  const id = (body.id || '').toString();
  const row = await lookup(env, id, (body.token || '').toString());
  if (!row) return json({ ok: false, error: 'Booking not found.' }, { status: 404 });
  if (row.status === 'cancelled') return json({ ok: true, alreadyCancelled: true, booking: summary(row) });

  if (env.DB) {
    await env.DB.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").bind(id).run();
  }
  if (row.gcal_event_id && isConfigured(env)) {
    try {
      await deleteEvent(env, BOOKING_CONTACTS.ownerCalendarId, row.gcal_event_id);
    } catch {
      /* the D1 row is already cancelled; the calendar can be reconciled from it */
    }
  }
  return json({ ok: true, booking: { ...summary(row), status: 'cancelled' } });
}

export function onRequestOptions() {
  return new Response(null, {
    status: 405,
    headers: { allow: 'GET, POST', 'cache-control': 'no-store' },
  });
}
