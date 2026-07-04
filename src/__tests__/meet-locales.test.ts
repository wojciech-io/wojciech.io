import { describe, it, expect } from 'vitest';
import { meetCopy, MEET_LOCALES, getMeetCopy, meetAlternates, type MeetStrings } from '../data/meet';
import { MEETING_TYPES } from '../data/booking';
import { ALL_LOCALES } from '../data/locale-codes';

// Every scalar (non-object) field on MeetStrings that must be a non-empty string.
const SCALAR_KEYS: Array<keyof MeetStrings> = [
  'title', 'description', 'eyebrow', 'h1', 'lead',
  'step1', 'step2', 'step3', 'tzLabel', 'tzLocal', 'selectDay',
  'name', 'email', 'company', 'optional', 'notesQ',
  'namePh', 'emailPh', 'companyPh', 'notesPh',
  'confirm', 'booking', 'trust', 'summaryEmpty', 'summaryPickTime',
  'successTitle', 'loading', 'loadingAvail', 'loadError', 'genericError',
];

describe('meet scheduler i18n', () => {
  it('covers every site locale', () => {
    expect([...MEET_LOCALES].sort()).toEqual([...ALL_LOCALES].sort());
    for (const locale of ALL_LOCALES) {
      expect(meetCopy[locale], `missing copy for ${locale}`).toBeDefined();
    }
  });

  it('has non-empty strings for every scalar key in every locale', () => {
    for (const locale of ALL_LOCALES) {
      const copy = meetCopy[locale];
      for (const key of SCALAR_KEYS) {
        const value = copy[key];
        expect(typeof value, `${locale}.${String(key)} should be a string`).toBe('string');
        expect((value as string).trim().length, `${locale}.${String(key)} is empty`).toBeGreaterThan(0);
      }
    }
  });

  it('localizes every meeting type id from booking.ts', () => {
    for (const locale of ALL_LOCALES) {
      for (const type of MEETING_TYPES) {
        const t = meetCopy[locale].types[type.id];
        expect(t, `${locale} missing type ${type.id}`).toBeDefined();
        expect(t.name.trim().length, `${locale}.${type.id}.name empty`).toBeGreaterThan(0);
        expect(t.desc.trim().length, `${locale}.${type.id}.desc empty`).toBeGreaterThan(0);
      }
    }
  });

  it('falls back to English for an unknown locale', () => {
    // @ts-expect-error probing runtime fallback with an invalid locale
    expect(getMeetCopy('zz')).toBe(meetCopy.en);
  });

  it('emits a reciprocal hreflang cluster (x-default + en + 7 locales)', () => {
    const langs = meetAlternates.map((a) => a.lang);
    expect(langs).toContain('x-default');
    expect(langs).toContain('en');
    // x-default + en + one entry per non-English locale
    expect(meetAlternates.length).toBe(2 + (ALL_LOCALES.length - 1));
    expect(meetAlternates.every((a) => a.href.includes('/meet/'))).toBe(true);
  });
});
