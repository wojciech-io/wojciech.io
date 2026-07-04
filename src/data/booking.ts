// Single source of truth for the /meet scheduler.
// Imported by the front-end (src/pages/meet.astro) AND the Pages Functions
// (functions/api/*). Keep it dependency-free so it bundles cleanly on both
// the Astro and the Workers side.

export interface MeetingType {
  id: string;
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
    desc: 'Quick fit check. Recruiting, partnership, or fast context before anything bigger.',
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
  ownerTimezone: 'Europe/Warsaw',
  /** 0=Sun … 6=Sat. Mon–Fri. */
  workingDays: [1, 2, 3, 4, 5],
  /** Local clock window, inclusive start, exclusive end (a slot must fit fully). */
  workStart: '09:00',
  workEnd: '17:00',
  /** Grid granularity in minutes. Every candidate start sits on this step. */
  slotStepMinutes: 30,
  /** No same-hour bookings: earliest slot is now + this many hours. */
  minNoticeHours: 12,
  /** Latest slot is now + this many days. */
  horizonDays: 30,
  /** Padding kept free before and after every meeting. */
  bufferMinutes: 10,
} as const;

/** Owner-side calendar targets. hello@ is an alias, so it rides as an attendee. */
export const BOOKING_CONTACTS = {
  /** Real Google Calendar the event is written to. */
  ownerCalendarId: 'w.luszczynski@gmail.com',
  /** Second address that should also get the invite (attendee + email copy). */
  aliasEmail: 'hello@wojciech.io',
  /** From: address for the confirmation email (must be a verified Resend sender). */
  fromEmail: 'Wojciech Łuszczyński <hello@wojciech.io>',
} as const;
