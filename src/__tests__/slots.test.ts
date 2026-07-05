import { describe, it, expect } from 'vitest';
import {
  zonedTimeToUtc,
  zonedYMD,
  generateAvailability,
  type AvailabilityRules,
} from '../../functions/_utils/slots';

// Mirrors BOOKING_RULES: Berlin, weekdays 08:00–19:00, weekends 09:00–14:00.
const RULES: AvailabilityRules = {
  ownerTimezone: 'Europe/Berlin',
  hours: {
    1: { start: '08:00', end: '19:00' },
    2: { start: '08:00', end: '19:00' },
    3: { start: '08:00', end: '19:00' },
    4: { start: '08:00', end: '19:00' },
    5: { start: '08:00', end: '19:00' },
    6: { start: '09:00', end: '14:00' },
    0: { start: '09:00', end: '14:00' },
  },
  slotStepMinutes: 30,
  minNoticeHours: 12,
  horizonDays: 30,
  bufferMinutes: 10,
};

describe('zonedTimeToUtc (DST-safe)', () => {
  it('maps 08:00 Berlin to 07:00Z in winter (CET, +01:00)', () => {
    expect(zonedTimeToUtc(2026, 1, 8, 8, 0, 'Europe/Berlin').toISOString()).toBe(
      '2026-01-08T07:00:00.000Z'
    );
  });
  it('maps 08:00 Berlin to 06:00Z in summer (CEST, +02:00)', () => {
    expect(zonedTimeToUtc(2026, 7, 8, 8, 0, 'Europe/Berlin').toISOString()).toBe(
      '2026-07-08T06:00:00.000Z'
    );
  });
});

describe('zonedYMD', () => {
  it('reports the local calendar date across the UTC midnight boundary', () => {
    // 2026-07-08T23:30Z is already 2026-07-09 01:30 in Berlin (summer +2).
    expect(zonedYMD(new Date('2026-07-08T23:30:00Z'), 'Europe/Berlin')).toEqual({
      y: 2026,
      m: 7,
      d: 9,
    });
  });
});

describe('generateAvailability', () => {
  const now = new Date('2026-01-01T00:00:00Z'); // Thursday

  it('fills the long weekday window for a 45-min meeting', () => {
    const slots = generateAvailability({ rules: RULES, durationMin: 45, now, busy: [] });
    const jan8 = slots.filter((s) => s.startsWith('2026-01-08')); // Thursday, clean
    expect(jan8).toHaveLength(21);
    expect(jan8[0]).toBe('2026-01-08T07:00:00.000Z'); // 08:00 Berlin winter
    expect(jan8.at(-1)).toBe('2026-01-08T17:00:00.000Z'); // 18:00 Berlin, ends 18:45
  });

  it('opens weekends on the short morning window', () => {
    const slots = generateAvailability({ rules: RULES, durationMin: 30, now, busy: [] });
    const sat = slots.filter((s) => s.startsWith('2026-01-03')); // Saturday
    expect(sat.length).toBe(10);
    expect(sat[0]).toBe('2026-01-03T08:00:00.000Z'); // 09:00 Berlin
    expect(sat.at(-1)).toBe('2026-01-03T12:30:00.000Z'); // 13:30 Berlin, ends 14:00
    // A weekday offers strictly more than a weekend.
    const mon = slots.filter((s) => s.startsWith('2026-01-05'));
    expect(mon.length).toBeGreaterThan(sat.length);
  });

  it('respects minimum notice', () => {
    const slots = generateAvailability({ rules: RULES, durationMin: 30, now, busy: [] });
    const earliest = now.getTime() + RULES.minNoticeHours * 3600_000;
    expect(slots.every((s) => Date.parse(s) >= earliest)).toBe(true);
  });

  it('removes slots that clash with a busy interval (plus buffer)', () => {
    const busy = [{ start: '2026-01-08T09:00:00Z', end: '2026-01-08T10:00:00Z' }];
    const slots = generateAvailability({ rules: RULES, durationMin: 45, now, busy });
    const jan8 = slots.filter((s) => s.startsWith('2026-01-08'));
    // Busy 09:00–10:00Z expands by the 10-min buffer to [08:50, 10:10Z]:
    expect(jan8).not.toContain('2026-01-08T08:30:00.000Z'); // 08:30–09:15 overlaps
    expect(jan8).not.toContain('2026-01-08T09:00:00.000Z');
    expect(jan8).not.toContain('2026-01-08T10:00:00.000Z'); // 10:00 < 10:10 buffer end
    expect(jan8).toContain('2026-01-08T08:00:00.000Z'); // 08:00–08:45, clear of 08:50
    expect(jan8).toContain('2026-01-08T10:30:00.000Z'); // clear after buffer
  });

  it('stays within the horizon', () => {
    const slots = generateAvailability({ rules: RULES, durationMin: 30, now, busy: [] });
    const latest = now.getTime() + RULES.horizonDays * 86_400_000;
    expect(slots.every((s) => Date.parse(s) <= latest)).toBe(true);
  });
});
