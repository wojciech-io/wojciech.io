import { describe, it, expect } from 'vitest';
import { localizedHome, localizedHomeList } from '../data/locales';
import { localizedPages, localizedPageSlugs } from '../data/localizedPages';

const EXPECTED_LOCALES = ['de', 'dk', 'no', 'jp'] as const;
const EXPECTED_SLUGS = ['about', 'work', 'ai-systems', 'contact', 'insights'] as const;

describe('localizedHome', () => {
  it('covers exactly the expected locale keys', () => {
    expect(Object.keys(localizedHome).sort()).toEqual([...EXPECTED_LOCALES].sort());
  });

  it.each(EXPECTED_LOCALES)('%s: has required string fields', (locale) => {
    const copy = localizedHome[locale];
    const required: (keyof typeof copy)[] = [
      'key', 'path', 'code', 'label', 'htmlLang', 'hreflang', 'ogLocale',
      'title', 'description', 'eyebrow', 'h1Primary', 'h1Secondary', 'lead',
      'primaryCta', 'secondaryCta', 'finalHeading', 'finalSubtext',
    ];
    for (const field of required) {
      expect(typeof copy[field], `${locale}.${field} must be a string`).toBe('string');
      expect((copy[field] as string).length, `${locale}.${field} must not be empty`).toBeGreaterThan(0);
    }
  });

  it.each(EXPECTED_LOCALES)('%s: proof array has 4 entries with value and label', (locale) => {
    const { proof } = localizedHome[locale];
    expect(proof.length, `${locale} proof count`).toBe(4);
    for (const item of proof) {
      expect(item.value.length).toBeGreaterThan(0);
      expect(item.label.length).toBeGreaterThan(0);
    }
  });

  it.each(EXPECTED_LOCALES)('%s: steps array has 4 entries', (locale) => {
    const { steps } = localizedHome[locale];
    expect(steps.length, `${locale} steps count`).toBe(4);
    for (const step of steps) {
      expect(step.step.length).toBeGreaterThan(0);
      expect(step.title.length).toBeGreaterThan(0);
      expect(step.body.length).toBeGreaterThan(20);
    }
  });

  it('localizedHomeList has one entry per locale', () => {
    expect(localizedHomeList.length).toBe(EXPECTED_LOCALES.length);
  });
});

describe('localizedPages', () => {
  it('covers exactly the expected page slugs', () => {
    expect(localizedPageSlugs.sort()).toEqual([...EXPECTED_SLUGS].sort());
  });

  it('has one entry per locale × page combination', () => {
    expect(localizedPages.length).toBe(EXPECTED_LOCALES.length * EXPECTED_SLUGS.length);
  });

  it('each entry has a non-empty locale, slug, title, description, h1, and lead', () => {
    for (const copy of localizedPages) {
      expect(copy.locale.length, `locale field empty`).toBeGreaterThan(0);
      expect(copy.slug.length, `slug field empty in ${copy.locale}`).toBeGreaterThan(0);
      expect(copy.title.length, `${copy.locale}/${copy.slug} title empty`).toBeGreaterThan(5);
      expect(copy.description.length, `${copy.locale}/${copy.slug} desc empty`).toBeGreaterThan(20);
      expect(copy.h1.length, `${copy.locale}/${copy.slug} h1 empty`).toBeGreaterThan(5);
      expect(copy.lead.length, `${copy.locale}/${copy.slug} lead empty`).toBeGreaterThan(20);
    }
  });

  it('each entry has a stats array with at least 2 entries', () => {
    for (const copy of localizedPages) {
      expect(copy.stats.length, `${copy.locale}/${copy.slug} stats`).toBeGreaterThanOrEqual(2);
      for (const stat of copy.stats) {
        expect(stat.value.length).toBeGreaterThan(0);
        expect(stat.label.length).toBeGreaterThan(0);
      }
    }
  });

  it('each entry has a sections array with at least 2 sections', () => {
    for (const copy of localizedPages) {
      expect(copy.sections.length, `${copy.locale}/${copy.slug} sections`).toBeGreaterThanOrEqual(2);
      for (const section of copy.sections) {
        expect(section.title.length).toBeGreaterThan(0);
        expect(section.body.length).toBeGreaterThan(20);
      }
    }
  });

  it('primaryHref is a valid internal path', () => {
    for (const copy of localizedPages) {
      expect(copy.primaryHref, `${copy.locale}/${copy.slug} primaryHref`).toMatch(/^\//);
    }
  });

  it('secondaryHref is a non-empty string (internal or external)', () => {
    for (const copy of localizedPages) {
      expect(typeof copy.secondaryHref, `${copy.locale}/${copy.slug} secondaryHref type`).toBe('string');
      expect(copy.secondaryHref.length, `${copy.locale}/${copy.slug} secondaryHref empty`).toBeGreaterThan(0);
    }
  });
});
