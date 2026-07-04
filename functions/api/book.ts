// POST /api/book
// Creates a booking: validates input, re-checks the slot is genuinely free
// (authoritative, race-safe), records it in D1, writes the Google Calendar
// event (best-effort), and emails a confirmation with an .ics invite via Resend.

import { BOOKING_RULES, BOOKING_CONTACTS, MEETING_BY_ID } from '../../src/data/booking';
import { generateAvailability, type AvailabilityRules, type BusyInterval } from '../_utils/slots';
import { isConfigured, queryFreeBusy, insertEvent } from '../_utils/gcal';
import { buildIcs } from '../_utils/ics';
import { confirmationEmail, hostEmail, type BookingEmailData } from '../_utils/emails';
import { googleCalendarUrl, outlookCalendarUrl } from '../_utils/calendar-links';
import { rateLimit, clientIp } from '../_utils/ratelimit';

interface Env {
  DB?: D1Database;
  RATE_LIMIT?: KVNamespace;
  RESEND_API_KEY?: string;
  GCAL_CLIENT_ID?: string;
  GCAL_CLIENT_SECRET?: string;
  GCAL_REFRESH_TOKEN?: string;
}

interface BookPayload {
  meetingType?: string;
  start?: string; // ISO UTC
  name?: string;
  email?: string;
  company?: string;
  notes?: string;
  website?: string; // honeypot
  elapsed?: number; // ms since form render
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rules: AvailabilityRules = { ...BOOKING_RULES, workingDays: [...BOOKING_RULES.workingDays] };

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...init.headers },
  });
}

/** UTF-8 safe base64 for the .ics attachment. */
function toBase64(text: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(text)));
}

const TZ = rules.ownerTimezone;
/** "Monday, 7 July 2026" in the owner timezone. */
function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(d);
}
/** "09:00" in the owner timezone, 24h. */
function fmtHM(d: Date): string {
  return new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
}
/** Short zone name for the instant, e.g. "CEST" (falls back to the IANA id). */
function fmtZone(d: Date): string {
  const part = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, timeZoneName: 'short' })
    .formatToParts(d)
    .find((p) => p.type === 'timeZoneName');
  return part?.value ?? TZ;
}
/** "4 July 2026" for the email masthead. */
function fmtSendDate(d: Date): string {
  return new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  const rl = await rateLimit(env.RATE_LIMIT, `book:${clientIp(request)}`, 5, 600);
  if (!rl.ok) return rl.response!;

  let p: BookPayload;
  try {
    p = (await request.json()) as BookPayload;
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  // Bot filters: honeypot filled or submitted implausibly fast. Fake success so
  // scripts learn nothing and no booking / email / calendar write happens.
  if (p.website || (typeof p.elapsed === 'number' && p.elapsed < 2000)) {
    return json({ ok: true, id: 'ignored' });
  }

  const mt = p.meetingType ? MEETING_BY_ID[p.meetingType] : undefined;
  if (!mt) return json({ ok: false, error: 'Unknown meeting type.' }, { status: 400 });

  const name = (p.name || '').trim();
  if (name.length < 1 || name.length > 100) {
    return json({ ok: false, error: 'Please enter your name.' }, { status: 400 });
  }
  const email = (p.email || '').trim().toLowerCase();
  if (email.length > 254 || !emailPattern.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
  }
  const company = (p.company || '').trim().slice(0, 120);
  const notes = (p.notes || '').trim().slice(0, 2000);

  const startMs = Date.parse(p.start || '');
  if (!Number.isFinite(startMs)) {
    return json({ ok: false, error: 'Invalid start time.' }, { status: 400 });
  }
  const start = new Date(startMs);
  const end = new Date(startMs + mt.minutes * 60_000);

  // Authoritative availability re-check. Regenerating from the same rules +
  // live busy set means an arbitrary or already-taken time is rejected, closing
  // the gap between the client's earlier availability read and this write.
  const now = new Date();
  const horizonEndIso = new Date(now.getTime() + rules.horizonDays * 86_400_000).toISOString();
  const busy: BusyInterval[] = [];
  if (env.DB) {
    const rows = await env.DB.prepare(
      "SELECT start_utc, end_utc FROM bookings WHERE status = 'confirmed' AND end_utc > ? AND start_utc < ?"
    )
      .bind(now.toISOString(), horizonEndIso)
      .all<{ start_utc: string; end_utc: string }>();
    for (const r of rows.results ?? []) busy.push({ start: r.start_utc, end: r.end_utc });
  }
  if (isConfigured(env)) {
    try {
      busy.push(...(await queryFreeBusy(env, BOOKING_CONTACTS.freeBusyCalendarIds, now.toISOString(), horizonEndIso)));
    } catch {
      /* degrade to D1-only */
    }
  }
  const available = generateAvailability({ rules, durationMin: mt.minutes, now, busy });
  if (!available.includes(start.toISOString())) {
    return json({ ok: false, error: 'That slot is no longer available. Please pick another.' }, { status: 409 });
  }

  const id = crypto.randomUUID();
  const cancelToken = (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, '');

  if (env.DB) {
    await env.DB.prepare(
      `INSERT INTO bookings
         (id, meeting_type, start_utc, end_utc, duration_min, name, email, company, notes, status, cancel_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?)`
    )
      .bind(id, mt.id, start.toISOString(), end.toISOString(), mt.minutes, name, email, company || null, notes || null, cancelToken)
      .run();
  }

  // Google Calendar is best-effort: a hiccup must not lose a confirmed booking.
  if (isConfigured(env)) {
    try {
      const eventId = await insertEvent(env, BOOKING_CONTACTS.ownerCalendarId, {
        summary: `${mt.name} · ${name}`,
        description: notes ? `From ${name} (${email}).\n\n${notes}` : `From ${name} (${email}).`,
        startUtcIso: start.toISOString(),
        endUtcIso: end.toISOString(),
        timeZone: rules.ownerTimezone,
        attendees: [
          { email, displayName: name },
          { email: BOOKING_CONTACTS.aliasEmail },
        ],
      });
      if (env.DB && eventId) {
        await env.DB.prepare('UPDATE bookings SET gcal_event_id = ? WHERE id = ?').bind(eventId, id).run();
      }
    } catch {
      /* keep the booking; calendar can be reconciled from the D1 row */
    }
  }

  // Guest confirmation + host notification, with the .ics invite. Both emails
  // share one rendered data object; a send failure must not 500 a saved booking.
  if (env.RESEND_API_KEY) {
    const origin = new URL(request.url).origin;
    const manageUrl = `${origin}/meet/cancel?id=${id}&token=${cancelToken}`;
    const title = `${mt.name} with Wojciech Łuszczyński`;
    const ics = buildIcs({
      uid: `${id}@wojciech.io`,
      start,
      end,
      summary: title,
      description: notes || undefined,
      organizerName: 'Wojciech Łuszczyński',
      organizerEmail: 'hello@wojciech.io',
      attendeeName: name,
      attendeeEmail: email,
    });
    const data: BookingEmailData = {
      base: origin,
      name,
      guestEmail: email,
      company: company || undefined,
      meetingName: mt.name,
      minutes: mt.minutes,
      dateLine: fmtDate(start),
      timeLine: `${fmtHM(start)} – ${fmtHM(end)}`,
      tzLine: `${fmtZone(start)} · ${TZ}`,
      note: notes || undefined,
      manageUrl,
      gcalUrl: googleCalendarUrl({ title, start, end, details: notes || undefined }),
      outlookUrl: outlookCalendarUrl({ title, start, end, details: notes || undefined }),
      sendDate: fmtSendDate(now),
    };
    const guest = confirmationEmail(data);
    const host = hostEmail(data);
    const send = (payload: Record<string, unknown>) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {
        /* email failure must not 500 a recorded booking */
      });
    await Promise.all([
      send({
        from: BOOKING_CONTACTS.fromEmail,
        to: email,
        reply_to: 'hello@wojciech.io',
        subject: guest.subject,
        html: guest.html,
        attachments: [{ filename: 'invite.ics', content: toBase64(ics), content_type: 'text/calendar' }],
      }),
      send({
        from: BOOKING_CONTACTS.fromEmail,
        to: BOOKING_CONTACTS.aliasEmail,
        reply_to: email,
        subject: host.subject,
        html: host.html,
      }),
    ]);
  }

  return json({ ok: true, id, start: start.toISOString(), end: end.toISOString() });
}

export function onRequestGet() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405 });
}

export function onRequestOptions() {
  return new Response(null, { status: 405, headers: { allow: 'POST', 'cache-control': 'no-store' } });
}
