import { beforeAll, describe, expect, it } from 'vitest';
import { html, htmlLang, meta, requireDist } from './helpers';

/**
 * Ported from tests/e2e/locale-html-lang.spec.ts.
 *
 * A missing or wrong lang attribute is a WCAG 3.1.1 (Level A) failure that axe
 * may not catch if locale routing silently falls back to English.
 */

const LOCALE_PAGES = [
  { path: '/de/', htmlLang: 'de-DE', ogLocale: 'de_DE' },
  { path: '/dk/', htmlLang: 'da-DK', ogLocale: 'da_DK' },
  { path: '/no/', htmlLang: 'nb-NO', ogLocale: 'nb_NO' },
  { path: '/jp/', htmlLang: 'ja-JP', ogLocale: 'ja_JP' },
] as const;

// Insights live only in EN+PL; the remaining locales keep about/work/etc.
const LOCALE_SUBPAGES = ['about', 'work', 'ai-systems', 'contact'] as const;

describe('locale lang attributes', () => {
  beforeAll(requireDist);

  for (const { path, htmlLang: lang, ogLocale } of LOCALE_PAGES) {
    it(`${path} renders html[lang="${lang}"]`, () => {
      expect(htmlLang(html(path)), `html[lang] on ${path}`).toBe(lang);
    });

    it(`${path} has og:locale="${ogLocale}"`, () => {
      expect(meta(html(path), 'og:locale'), `og:locale on ${path}`).toBe(ogLocale);
    });
  }

  it('EN pages use html[lang="en"]', () => {
    for (const path of ['/', '/about/', '/work/', '/ai-systems/', '/insights/', '/contact/']) {
      expect(htmlLang(html(path)), `html[lang] on ${path}`).toBe('en');
    }
  });

  for (const { path, htmlLang: lang } of LOCALE_PAGES) {
    const locale = path.slice(1, -1);
    for (const slug of LOCALE_SUBPAGES) {
      it(`/${locale}/${slug}/ renders html[lang="${lang}"]`, () => {
        // html() throws when the page was not built, which covers the old
        // "must load with 200" assertion.
        expect(htmlLang(html(`/${locale}/${slug}/`)), `html[lang] on /${locale}/${slug}/`).toBe(lang);
      });
    }
  }
});
