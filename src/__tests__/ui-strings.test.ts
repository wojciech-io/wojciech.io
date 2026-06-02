import { describe, it, expect } from 'vitest';
import {
  getLocaleFromPath,
  getUiStrings,
  getUiStringsForPath,
  localizeHref,
  getPrimaryNavLinks,
} from '../data/uiStrings';

const NON_EN_LOCALES = ['pl', 'de', 'dk', 'no', 'jp', 'it', 'es'] as const;

describe('getLocaleFromPath', () => {
  it('returns "en" for the root and unknown segments', () => {
    expect(getLocaleFromPath('/')).toBe('en');
    expect(getLocaleFromPath('')).toBe('en');
    expect(getLocaleFromPath('/work/')).toBe('en');
    expect(getLocaleFromPath('/insights/some-article/')).toBe('en');
    expect(getLocaleFromPath('/zz/')).toBe('en');
  });

  it.each(NON_EN_LOCALES)('detects /%s/ as the locale', (locale) => {
    expect(getLocaleFromPath(`/${locale}/`)).toBe(locale);
    expect(getLocaleFromPath(`/${locale}/about/`)).toBe(locale);
  });
});

describe('localizeHref', () => {
  it('returns the input unchanged for EN', () => {
    expect(localizeHref('/work/', 'en')).toBe('/work/');
    expect(localizeHref('/contact/', 'en')).toBe('/contact/');
  });

  it('prefixes leading-slash paths with the active locale', () => {
    expect(localizeHref('/work/', 'de')).toBe('/de/work/');
    expect(localizeHref('/about/', 'pl')).toBe('/pl/about/');
    expect(localizeHref('/contact/', 'jp')).toBe('/jp/contact/');
  });

  it('leaves absolute, hash, and external links alone', () => {
    expect(localizeHref('https://example.com/', 'de')).toBe('https://example.com/');
    expect(localizeHref('//cdn.example/x', 'de')).toBe('//cdn.example/x');
    expect(localizeHref('#section', 'de')).toBe('#section');
    expect(localizeHref('mailto:x@y.z', 'de')).toBe('mailto:x@y.z');
  });

  it('does not double-prefix already-localized hrefs', () => {
    expect(localizeHref('/de/work/', 'de')).toBe('/de/work/');
    expect(localizeHref('/pl/', 'pl')).toBe('/pl/');
  });
});

describe('getUiStrings', () => {
  it('returns a full strings bundle for every locale (no missing keys)', () => {
    const REQUIRED = [
      'nav.work', 'nav.aiSystems', 'nav.insights', 'nav.tools', 'nav.about', 'nav.contact',
      'cta.bookCall', 'cta.nextStep',
      'cookie.bannerText', 'cookie.privacyPolicy', 'cookie.accept', 'cookie.reject',
      'footer.getInTouch', 'footer.allWriting', 'footer.brandTagline', 'footer.bottomTagline',
    ];
    for (const locale of ['en', ...NON_EN_LOCALES] as const) {
      const t = getUiStrings(locale);
      for (const path of REQUIRED) {
        const [group, key] = path.split('.') as [keyof typeof t, string];
        const value = (t[group] as Record<string, string>)[key];
        expect(value, `${locale}.${path}`).toBeTruthy();
        expect(typeof value, `${locale}.${path}`).toBe('string');
      }
    }
  });

  it('uses distinct, non-English copy for the localized CTA on each locale', () => {
    const en = getUiStrings('en');
    for (const locale of NON_EN_LOCALES) {
      const t = getUiStrings(locale);
      expect(t.cta.bookCall, `${locale}.cta.bookCall`).not.toBe(en.cta.bookCall);
      expect(t.cookie.accept, `${locale}.cookie.accept`).not.toBe(en.cookie.accept);
    }
  });

  it('contains no em dashes in any visible string (tone-of-voice ban)', () => {
    for (const locale of ['en', ...NON_EN_LOCALES] as const) {
      const t = getUiStrings(locale);
      const flat = JSON.stringify(t);
      expect(flat, `${locale} contains em dash`).not.toContain('—');
    }
  });
});

describe('getUiStringsForPath', () => {
  it('picks the right bundle for the path', () => {
    expect(getUiStringsForPath('/').nav.contact).toBe('Contact');
    expect(getUiStringsForPath('/pl/').nav.contact).toBe('Kontakt');
    expect(getUiStringsForPath('/de/about/').nav.about).toBe('Über mich');
    expect(getUiStringsForPath('/jp/').cta.bookCall).toContain('予約');
  });
});

describe('getPrimaryNavLinks', () => {
  it('returns seven links with localized labels and locale-prefixed hrefs', () => {
    const plLinks = getPrimaryNavLinks('/pl/');
    expect(plLinks).toHaveLength(7);
    const labels = plLinks.map((l) => l.label);
    expect(labels).toContain('Praca');
    expect(labels).toContain('Stack');
    expect(labels).toContain('Kontakt');
    // Locale-prefixed canonical pages:
    const hrefs = plLinks.map((l) => l.href);
    expect(hrefs).toContain('/pl/work/');
    expect(hrefs).toContain('/pl/contact/');
    expect(hrefs).toContain('/pl/about/');
    // /resources/ and /stack/ stay canonical (EN-only):
    expect(hrefs).toContain('/resources/');
    expect(hrefs).toContain('/stack/');
  });

  it('keeps EN paths canonical on the root path', () => {
    const enLinks = getPrimaryNavLinks('/');
    const hrefs = enLinks.map((l) => l.href);
    expect(hrefs).toContain('/work/');
    expect(hrefs).toContain('/contact/');
    expect(hrefs).not.toContain('/en/work/');
  });
});
