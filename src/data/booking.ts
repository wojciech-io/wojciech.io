// Single source of truth for the /meet scheduler.
// Imported by the front-end (src/pages/meet.astro) AND the Pages Functions
// (functions/api/*). Keep it dependency-free so it bundles cleanly on both
// the Astro and the Workers side.

/** Stable meeting-type ids. Shared by the localized copy table (data/meet.ts). */
export type MeetingId = 'intro' | 'followup' | 'systems';

export interface MeetingType {
  id: MeetingId;
  name: string;
  minutes: number;
  /** One-line description shown on the selection card. */
  desc: string;
  /** Visual emphasis on the picker; exactly one should be featured. */
  featured?: boolean;
}

export const MEETING_TYPES: MeetingType[] = [
  {
    id: 'intro',
    name: 'Intro / Fit Call',
    minutes: 15,
    desc: 'A short intro. Whether there is a fit, or fast context before a bigger conversation.',
  },
  {
    id: 'followup',
    name: 'Follow-up',
    minutes: 30,
    desc: 'Continuing an existing thread. For people I have already spoken with.',
  },
  {
    id: 'systems',
    name: 'Growth & AI Systems',
    minutes: 45,
    desc: 'The real strategy conversation. GTM, AI, and revenue systems, from your problem.',
    featured: true,
  },
];

export const MEETING_BY_ID: Record<string, MeetingType> = Object.fromEntries(
  MEETING_TYPES.map((m) => [m.id, m])
);

// Availability rules. Slots are generated in OWNER_TIMEZONE, then stored and
// compared in UTC so DST never corrupts a stored booking.
export const BOOKING_RULES = {
  /** IANA zone the working hours are expressed in. */
  ownerTimezone: 'Europe/Berlin',
  /**
   * Working window per weekday in the owner's local clock (0=Sun … 6=Sat).
   * A slot must fit fully inside [start, end). A weekday missing from the map
   * is closed. Weekdays run long; weekends are a short morning window.
   */
  hours: {
    1: { start: '08:00', end: '19:00' }, // Mon
    2: { start: '08:00', end: '19:00' }, // Tue
    3: { start: '08:00', end: '19:00' }, // Wed
    4: { start: '08:00', end: '19:00' }, // Thu
    5: { start: '08:00', end: '19:00' }, // Fri
    6: { start: '09:00', end: '14:00' }, // Sat
    0: { start: '09:00', end: '14:00' }, // Sun
  } as Record<number, { start: string; end: string }>,
  /** Grid granularity in minutes. Every candidate start sits on this step. */
  slotStepMinutes: 30,
  /** No same-hour bookings: earliest slot is now + this many hours. */
  minNoticeHours: 12,
  /** Latest slot is now + this many days. */
  horizonDays: 30,
  /** Padding kept free before and after every meeting. */
  bufferMinutes: 10,
};

/** Owner-side calendar targets. hello@ is an alias, so it rides as an attendee. */
export const BOOKING_CONTACTS = {
  /** Real Google Calendar the event is written to. */
  ownerCalendarId: 'w.luszczynski@gmail.com',
  /**
   * Every calendar whose busy-time blocks a booking, queried together in one
   * free/busy call. Add any extra Google calendar IDs here (a second account,
   * or calendars you subscribe into this one). Reclaim.ai does NOT need an API
   * integration: it already writes focus/habit/sync blocks into the primary
   * calendar, so those ride in automatically via free/busy.
   */
  freeBusyCalendarIds: ['w.luszczynski@gmail.com'],
  /** Second address that should also get the invite (attendee + email copy). */
  aliasEmail: 'hello@wojciech.io',
  /** From: address for the confirmation email (must be a verified Resend sender). */
  fromEmail: 'Wojciech Łuszczyński <hello@wojciech.io>',
} as const;
