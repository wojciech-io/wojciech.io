// POST /api/cron/reminders  — reminder dispatcher for the /meet scheduler.
//
// Cloudflare Pages Functions can't hold a cron trigger, so a tiny companion
// Worker (workers/meet-reminders) pings this endpoint every 15 minutes. Keeping
// the logic here means it reuses the same D1 binding and RESEND_API_KEY as the
// booking flow: provision the Resend secret once and both confirmations and
// reminders come alive together.
//
// Two independent, idempotent reminders per booking:
//   • 24h: sent once while the call is 1–24h away  (reminder_24h_sent_at)
//   • 1h : sent once while the call is 0–1h away    (reminder_1h_sent_at)
// A booking is only selected while its column is NULL; a successful send stamps
// it, so a re-run (or an overlapping cron tick) never double-sends. A send that
// fails leaves the column NULL and is retried on the next tick.

import { BOOKING_RULES, BOOKING_CONTACTS, MEETING_BY_ID } from '../../../src/data/booking';
import { reminderEmail, type BookingEmailData } from '../../_utils/emails';
import { fmtDate, fmtHM, fmtZone, fmtSendDate } from '../../_utils/format';
import { ensureChannel } from '../../_utils/gcal-channel';

interface Env {
  DB?: D1Database;
  RESEND_API_KEY?: string;
  CRON_SECRET?: string;
  GCAL_CLIENT_ID?: string;
  GCAL_CLIENT_SECRET?: string;
  GCAL_REFRESH_TOKEN?: string;
}

interface BookingRow {
  id: string;
  meeting_type: string;
  start_utc: string;
  end_utc: string;
  duration_min: number;
  name: string;
  email: string;
  company: string | null;
  notes: string | null;
  cancel_token: string;
}

const TZ = BOOKING_RULES.ownerTimezone;
const ORIGIN = 'https://wojciech.io';

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...init.headers },
  });
}

/** Build the shared email data object for one booking row. */
function emailData(row: BookingRow): BookingEmailData {
  const start = new Date(row.start_utc);
  const end = new Date(row.end_utc);
  const mt = MEETING_BY_ID[row.meeting_type];
  return {
    base: ORIGIN,
    name: row.name,
    guestEmail: row.email,
    company: row.company || undefined,
    meetingName: mt?.name ?? row.meeting_type,
    minutes: row.duration_min,
    dateLine: fmtDate(start, TZ),
    timeLine: `${fmtHM(start, TZ)} to ${fmtHM(end, TZ)}`,
    tzLine: `${fmtZone(start, TZ)} · ${TZ}`,
    note: row.notes || undefined,
    manageUrl: `${ORIGIN}/meet/cancel?id=${row.id}&token=${row.cancel_token}`,
    // Not rendered in the reminder body, but required by the shared type.
    gcalUrl: `${ORIGIN}/meet/`,
    outlookUrl: `${ORIGIN}/meet/`,
    sendDate: fmtSendDate(new Date(), TZ),
  };
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  // Shared-secret gate: only the companion cron Worker knows CRON_SECRET.
  const auth = request.headers.get('authorization') || '';
  if (!env.CRON_SECRET || auth !== `Bearer ${env.CRON_SECRET}`) {
    return json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  }
  if (!env.DB) return json({ ok: false, error: 'No database binding.' }, { status: 503 });
  if (!env.RESEND_API_KEY) return json({ ok: false, error: 'No RESEND_API_KEY.' }, { status: 503 });

  const now = new Date();
  const nowIso = now.toISOString();
  const in1hIso = new Date(now.getTime() + 60 * 60_000).toISOString();
  const in24hIso = new Date(now.getTime() + 24 * 60 * 60_000).toISOString();

  // 24h bucket: 1–24h out and not yet reminded. 1h bucket: 0–1h out and not yet
  // reminded. The 24h window starts at now+1h so a booking made <1h before the
  // call gets only the 1h reminder, never both at once.
  const due24 = await env.DB.prepare(
    `SELECT id, meeting_type, start_utc, end_utc, duration_min, name, email, company, notes, cancel_token
       FROM bookings
      WHERE status = 'confirmed' AND reminder_24h_sent_at IS NULL
        AND start_utc > ? AND start_utc <= ?`
  ).bind(in1hIso, in24hIso).all<BookingRow>();

  const due1 = await env.DB.prepare(
    `SELECT id, meeting_type, start_utc, end_utc, duration_min, name, email, company, notes, cancel_token
       FROM bookings
      WHERE status = 'confirmed' AND reminder_1h_sent_at IS NULL
        AND start_utc > ? AND start_utc <= ?`
  ).bind(nowIso, in1hIso).all<BookingRow>();

  const jobs: { row: BookingRow; lead: 'tomorrow' | 'soon'; column: string }[] = [
    ...(due24.results ?? []).map((row) => ({ row, lead: 'tomorrow' as const, column: 'reminder_24h_sent_at' })),
    ...(due1.results ?? []).map((row) => ({ row, lead: 'soon' as const, column: 'reminder_1h_sent_at' })),
  ];

  let sent = 0;
  const failures: string[] = [];
  for (const { row, lead, column } of jobs) {
    const mail = reminderEmail(emailData(row), lead);
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: BOOKING_CONTACTS.fromEmail,
          to: row.email,
          reply_to: 'hello@wojciech.io',
          subject: mail.subject,
          html: mail.html,
        }),
      });
      if (!res.ok) {
        failures.push(`${row.id}:${res.status}`);
        continue; // leave the column NULL so the next tick retries
      }
      // Stamp only after a confirmed send.
      await env.DB.prepare(`UPDATE bookings SET ${column} = ? WHERE id = ?`).bind(nowIso, row.id).run();
      sent += 1;
    } catch (e) {
      failures.push(`${row.id}:err`);
    }
  }

  // Piggyback the 15-min tick to keep the Google Calendar push channel alive
  // (registers on first run after deploy, renews before the 7-day expiry).
  const channel = (await ensureChannel(env, `${ORIGIN}/api/gcal/webhook`, Date.now())).status;

  return json({ ok: true, scanned: jobs.length, sent, failures, channel });
}

export function onRequestGet() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405 });
}
