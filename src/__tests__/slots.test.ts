import { describe, it, expect } from 'vitest';
import {
  zonedTimeToUtc,
  zonedYMD,
  generateAvailability,
  type AvailabilityRules,
} from '../../functions/_utils/slots';

const RULES: AvailabilityRules = {
  ownerTimezone: 'Europe/Warsaw',
  workingDays: [1, 2, 3, 4, 5],
  workStart: '09:00',
  workEnd: '17:00',
  slotStepMinutes: 30,
  minNoticeHours: 12,
  horizonDays: 30,
  bufferMinutes: 10,
};

describe('zonedTimeToUtc (DST-safe)', () => {
  it('maps 09:00 Warsaw to 08:00Z in winter (CET, +01:00)', () => {
    expect(zonedTimeToUtc(2026, 1, 8, 9, 0, 'Europe/Warsaw').toISOString()).toBe(
      '2026-01-08T08:00:00.000Z'
    );
  });
  it('maps 09:00 Warsaw to 07:00Z in summer (CEST, +02:00)', () => {
    expect(zonedTimeToUtc(2026, 7, 8, 9, 0, 'Europe/Warsaw').toISOString()).toBe(
      '2026-07-08T07:00:00.000Z'
    );
  });
});

describe('zonedYMD', () => {
  it('reports the local calendar date across the UTC midnight boundary', () => {
    // 2026-07-08T23:30Z is already 2026-07-09 01:30 in Warsaw (summer +2).
    expect(zonedYMD(new Date('2026-07-08T23:30:00Z'), 'Europe/Warsaw')).toEqual({
      y: 2026,
      m: 7,
      d: 9,
    });
  });
});

describe('generateAvailability', () => {
  const now = new Date('2026-01-01T00:00:00Z'); // Thursday

  it('produces 15 half-hour starts for a 45-min meeting on a clean weekday', () => {
    const slots = generateAvailability({ rules: RULES, durationMin: 45, now, busy: [] });
    const jan8 = slots.filter((s) => s.startsWith('2026-01-08')); // Thursday, clean
    expect(jan8).toHaveLength(15);
    expect(jan8[0]).toBe('2026-01-08T08:00:00.000Z'); // 09:00 Warsaw winter
    expect(jan8.at(-1)).toBe('2026-01-08T15:00:00.000Z'); // 16:00 Warsaw, ends 16:45
  });

  it('never returns weekend slots', () => {
    const slots = generateAvailability({ rules: RULES, durationMin: 30, now, busy: [] });
    // 2026-01-03 is a Saturday, 2026-01-04 a Sunday.
    expect(slots.some((s) => s.startsWith('2026-01-03'))).toBe(false);
    expect(slots.some((s) => s.startsWith('2026-01-04'))).toBe(false);
  });

  it('respects minimum notice', () => {
    const slots = generateAvailability({ rules: RULES, durationMin: 30, now, busy: [] });
    const earliest = now.getTime() + RULES.minNoticeHours * 3600_000;
    expect(slots.every((s) => Date.parse(s) >= earliest)).toBe(true);
  });

  it('removes slots that clash with a busy interval (plus buffer)', () => {
    const busy = [{ start: '2026-01-08T08:00:00Z', end: '2026-01-08T09:00:00Z' }];
    const slots = generateAvailability({ rules: RULES, durationMin: 45, now, busy });
    const jan8 = slots.filter((s) => s.startsWith('2026-01-08'));
    // Busy 08:00–09:00Z expands by the 10-min buffer to [07:50, 09:10Z]:
    expect(jan8).not.toContain('2026-01-08T08:00:00.000Z'); // directly overlapping
    expect(jan8).not.toContain('2026-01-08T08:30:00.000Z'); // inside buffer window
    expect(jan8).not.toContain('2026-01-08T09:00:00.000Z'); // 09:00 < 09:10 buffer end
    expect(jan8).toContain('2026-01-08T09:30:00.000Z'); // first clear start (10:30 Warsaw)
  });

  it('stays within the horizon', () => {
    const slots = generateAvailability({ rules: RULES, durationMin: 30, now, busy: [] });
    const latest = now.getTime() + RULES.horizonDays * 86_400_000;
    expect(slots.every((s) => Date.parse(s) <= latest)).toBe(true);
  });
});
