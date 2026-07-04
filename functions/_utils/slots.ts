// Pure, dependency-free availability math for the /meet scheduler.
// Kept free of Workers/DOM globals so it unit-tests under Vitest.
//
// Working hours are expressed in the owner's IANA zone but every produced slot
// is a UTC instant, so a booking made in July (CEST, +02:00) and one in January
// (CET, +01:00) both resolve to the correct absolute time. DST correctness comes
// from computing the zone offset AT the target instant via Intl, not from a
// fixed offset.

export interface BusyInterval {
  start: string; // ISO
  end: string; // ISO
}

export interface AvailabilityRules {
  ownerTimezone: string;
  workingDays: number[]; // 0=Sun … 6=Sat
  workStart: string; // 'HH:MM' local
  workEnd: string; // 'HH:MM' local
  slotStepMinutes: number;
  minNoticeHours: number;
  horizonDays: number;
  bufferMinutes: number;
}

/** Calendar Y/M/D that the given instant shows in `timeZone`. */
export function zonedYMD(date: Date, timeZone: string): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  return { y: get('year'), m: get('month'), d: get('day') };
}

/**
 * The UTC instant for a wall-clock time in `timeZone`. DST-safe: we guess by
 * treating the wall clock as UTC, ask the zone what wall clock that instant
 * actually shows, and correct by the difference (the true offset at that moment).
 */
export function zonedTimeToUtc(
  y: number,
  m: number,
  d: number,
  hh: number,
  mm: number,
  timeZone: string
): Date {
  const asUtc = Date.UTC(y, m - 1, d, hh, mm);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(new Date(asUtc));
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  let hour = get('hour');
  if (hour === 24) hour = 0; // some engines render midnight as 24
  const shown = Date.UTC(get('year'), get('month') - 1, get('day'), hour, get('minute'), get('second'));
  const offset = shown - asUtc;
  return new Date(asUtc - offset);
}

const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/**
 * Available UTC start instants (ISO strings) for a meeting of `durationMin`,
 * honouring working days/hours, min notice, horizon, and busy intervals padded
 * by the buffer.
 */
export function generateAvailability(opts: {
  rules: AvailabilityRules;
  durationMin: number;
  now: Date;
  busy: BusyInterval[];
}): string[] {
  const { rules, durationMin, now, busy } = opts;
  const earliest = now.getTime() + rules.minNoticeHours * 3600_000;
  const latest = now.getTime() + rules.horizonDays * 86_400_000;
  const bufferMs = rules.bufferMinutes * 60_000;

  // Pre-expand busy intervals by the buffer once.
  const blocked = busy
    .map((b) => ({ start: Date.parse(b.start) - bufferMs, end: Date.parse(b.end) + bufferMs }))
    .filter((b) => Number.isFinite(b.start) && Number.isFinite(b.end));

  const startMin = toMinutes(rules.workStart);
  const endMin = toMinutes(rules.workEnd);
  const base = zonedYMD(now, rules.ownerTimezone);
  const out: string[] = [];

  for (let i = 0; i <= rules.horizonDays; i++) {
    // Increment the calendar date via UTC date math (no DST in pure date math).
    const dayDate = new Date(Date.UTC(base.y, base.m - 1, base.d + i));
    const weekday = dayDate.getUTCDay();
    if (!rules.workingDays.includes(weekday)) continue;
    const y = dayDate.getUTCFullYear();
    const mo = dayDate.getUTCMonth() + 1;
    const da = dayDate.getUTCDate();

    for (let t = startMin; t + durationMin <= endMin; t += rules.slotStepMinutes) {
      const startUtc = zonedTimeToUtc(y, mo, da, Math.floor(t / 60), t % 60, rules.ownerTimezone);
      const startMs = startUtc.getTime();
      const endMs = startMs + durationMin * 60_000;
      if (startMs < earliest || startMs > latest) continue;
      const clash = blocked.some((b) => startMs < b.end && endMs > b.start);
      if (clash) continue;
      out.push(startUtc.toISOString());
    }
  }
  return out;
}
