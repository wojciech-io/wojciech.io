// Shared, locale-safe display formatting for booking emails. Owner timezone in,
// human strings out. Used by the /api/book endpoint and the reminder cron so
// both render identical date/time lines from the same UTC Date objects.

/** "Monday, 7 July 2026" in the given IANA zone. */
export function fmtDate(d: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(d);
}

/** "09:00" in the given zone, 24h. */
export function fmtHM(d: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(d);
}

/** Short zone name for the instant, e.g. "CEST" (falls back to the IANA id). */
export function fmtZone(d: Date, tz: string): string {
  const part = new Intl.DateTimeFormat('en-GB', { timeZone: tz, timeZoneName: 'short' })
    .formatToParts(d)
    .find((p) => p.type === 'timeZoneName');
  return part?.value ?? tz;
}

/** "4 July 2026" for the email masthead. */
export function fmtSendDate(d: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, day: 'numeric', month: 'long', year: 'numeric',
  }).format(d);
}
