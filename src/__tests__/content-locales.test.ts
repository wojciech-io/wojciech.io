import { describe, it, expect } from 'vitest';
import { localizedHome, localizedHomeList } from '../data/locales';
import {
  localizedPages,
  localizedPageSlugs,
  getLocalizedPage,
  localizedPageAlternates,
  htmlLangForLocale,
  ogLocaleForLocale,
} from '../data/localizedPages';

const EXPECTED_LOCALES = ['de', 'dk', 'no', 'jp', 'it', 'es', 'pl'] as const;
const EXPECTED_SLUGS = ['about', 'work', 'ai-systems', 'contact', 'insights'] as const;
const LOCALE_COPY_MARKERS: Record<(typeof EXPECTED_LOCALES)[number], RegExp[]> = {
  de: [/\bIch\b/, /\bfür\b/, /\bArbeit\b/, /\bSysteme\b/],
  dk: [/\bJeg\b/, /\bikke\b/, /\bhvad\b/i, /\bværktøj/i],
  no: [/\bJeg\b/, /\bikke\b/, /\barbeidet\b/i, /\bverktøy/i],
  jp: [/[\u3040-\u30ff]/, /[\u4e00-\u9faf]/],
  it: [/\blavoro\b/i, /\bsistema\b/i, /\boperatore\b/i],
  es: [/\btrabajo\b/i, /\bsistema\b/i, /\boperador\b/i],
  pl: [/\bsystem/i, /\bbuduj/i, /\boperacyjn/i, /\bpracuj/i],
};

function copyTextForLocale(locale: (typeof EXPECTED_LOCALES)[number]) {
  const home = localizedHome[locale];
  const homeText = [
    home.title,
    home.description,
    home.eyebrow,
    home.h1Primary,
    home.h1Secondary,
    home.lead,
    home.primaryCta,
    home.secondaryCta,
    home.finalHeading,
    home.finalSubtext,
    ...home.proof.flatMap((p) => [p.value, p.label]),
    ...home.steps.flatMap((s) => [s.step, s.title, s.body]),
  ];
  const pageText = localizedPages
    .filter((copy) => copy.locale === locale)
    .flatMap((copy) => [
      copy.title,
      copy.description,
      copy.eyebrow,
      copy.h1,
      copy.lead,
      copy.primaryCta,
      copy.secondaryCta,
      ...copy.stats.flatMap((s) => [s.value, s.label]),
      ...copy.sections.flatMap((s) => [s.title, s.body, ...(s.items ?? [])]),
    ]);
  return [...homeText, ...pageText].join(' ');
}

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

  it.each(EXPECTED_LOCALES)('%s: uses locale-specific copy instead of an EN stub', (locale) => {
    const text = copyTextForLocale(locale);
    expect(text.length, `${locale} copy is too short`).toBeGreaterThan(2500);
    for (const marker of LOCALE_COPY_MARKERS[locale]) {
      expect(text, `${locale} missing marker ${marker}`).toMatch(marker);
    }
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

  it('primaryHref is a valid path or Cal.com booking URL', () => {
    for (const copy of localizedPages) {
      if (copy.slug === 'contact') {
        expect(copy.primaryHref, `${copy.locale}/contact primaryHref`).toBe(
          'https://cal.com/wojciech-luszczynski/30min',
        );
      } else {
        expect(copy.primaryHref, `${copy.locale}/${copy.slug} primaryHref`).toMatch(/^\//);
      }
    }
  });

  it('localized CTA hrefs stay inside the active locale when a localized target exists', () => {
    for (const copy of localizedPages) {
      if (copy.slug === 'contact') {
        expect(copy.primaryHref, `${copy.locale}/contact primaryHref`).toBe(
          'https://cal.com/wojciech-luszczynski/30min',
        );
      }
      if (copy.slug === 'insights') {
        expect(copy.primaryHref, `${copy.locale}/insights primaryHref`).toBe(
          `/${copy.locale}/insights/`,
        );
      }
    }
  });

  it('secondaryHref is a non-empty string (internal or external)', () => {
    for (const copy of localizedPages) {
      expect(typeof copy.secondaryHref, `${copy.locale}/${copy.slug} secondaryHref type`).toBe('string');
      expect(copy.secondaryHref.length, `${copy.locale}/${copy.slug} secondaryHref empty`).toBeGreaterThan(0);
    }
  });
});

describe('localizedPages helper functions', () => {
  it('getLocalizedPage returns the correct entry for a locale/slug pair', () => {
    for (const locale of EXPECTED_LOCALES) {
      for (const slug of EXPECTED_SLUGS) {
        const page = getLocalizedPage(locale, slug);
        expect(page.locale).toBe(locale);
        expect(page.slug).toBe(slug);
        expect(page.title.length).toBeGreaterThan(0);
        expect(page.h1.length).toBeGreaterThan(0);
      }
    }
  });

  it('localizedPageAlternates returns x-default, en, and one entry per locale', () => {
    for (const slug of EXPECTED_SLUGS) {
      const alternates = localizedPageAlternates(slug);
      // x-default + en + 4 locales
      expect(alternates.length).toBe(2 + EXPECTED_LOCALES.length);

      const xDefault = alternates.find((a) => a.lang === 'x-default');
      expect(xDefault?.href).toBe(`https://wojciech.io/${slug}/`);

      const en = alternates.find((a) => a.lang === 'en');
      expect(en?.href).toBe(`https://wojciech.io/${slug}/`);

      for (const locale of EXPECTED_LOCALES) {
        const entry = alternates.find((a) => a.href.includes(`/${locale}/`));
        expect(entry, `${locale}/${slug} alternate missing`).toBeDefined();
        expect(entry?.href).toMatch(/^https:\/\/wojciech\.io\//);
        expect(entry?.href).toContain(`/${slug}/`);
      }
    }
  });

  it.each(EXPECTED_LOCALES)('%s: htmlLangForLocale returns a valid BCP-47 language tag', (locale) => {
    const htmlLang = htmlLangForLocale(locale);
    expect(typeof htmlLang).toBe('string');
    expect(htmlLang.length).toBeGreaterThan(0);
    // BCP-47: should contain at least a 2-letter primary subtag
    expect(htmlLang).toMatch(/^[a-z]{2}/);
  });

  it.each(EXPECTED_LOCALES)('%s: ogLocaleForLocale returns a non-empty locale string', (locale) => {
    const ogLocale = ogLocaleForLocale(locale);
    expect(typeof ogLocale).toBe('string');
    expect(ogLocale.length).toBeGreaterThan(0);
    // OG locale format: ll_CC (e.g. de_DE, ja_JP)
    expect(ogLocale).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
  });
});
