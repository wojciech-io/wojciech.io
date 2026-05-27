import { test, expect } from '@playwright/test';

/**
 * Verifies that every locale page renders the correct BCP-47 lang attribute
 * on the <html> element and that the og:locale meta tag matches.
 *
 * A missing or wrong lang attribute is a WCAG 3.1.1 (Level A) failure that
 * axe may not catch if the locale routing silently falls back to English.
 */

const LOCALE_PAGES = [
  { path: '/de/', htmlLang: 'de-DE', ogLocale: 'de_DE' },
  { path: '/dk/', htmlLang: 'da-DK', ogLocale: 'da_DK' },
  { path: '/no/', htmlLang: 'nb-NO', ogLocale: 'nb_NO' },
  { path: '/jp/', htmlLang: 'ja-JP', ogLocale: 'ja_JP' },
] as const;

const LOCALE_SUBPAGES = ['about', 'work', 'ai-systems', 'contact', 'insights'] as const;

for (const { path, htmlLang, ogLocale } of LOCALE_PAGES) {
  test(`${path} renders html[lang="${htmlLang}"]`, async ({ page }) => {
    await page.goto(path);
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang, `html[lang] on ${path}`).toBe(htmlLang);
  });

  test(`${path} has og:locale="${ogLocale}"`, async ({ page }) => {
    await page.goto(path);
    const content = await page.locator('meta[property="og:locale"]').getAttribute('content');
    expect(content, `og:locale on ${path}`).toBe(ogLocale);
  });
}

test('EN pages use html[lang="en"]', async ({ page }) => {
  for (const path of ['/', '/about/', '/work/', '/ai-systems/', '/insights/', '/contact/']) {
    await page.goto(path);
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang, `html[lang] on ${path}`).toBe('en');
  }
});

for (const { path, htmlLang } of LOCALE_PAGES) {
  const locale = path.slice(1, -1);
  for (const slug of LOCALE_SUBPAGES) {
    test(`/${locale}/${slug}/ renders html[lang="${htmlLang}"]`, async ({ page }) => {
      const resp = await page.goto(`/${locale}/${slug}/`);
      expect(resp?.status(), `${locale}/${slug} must load`).toBe(200);
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang, `html[lang] on /${locale}/${slug}/`).toBe(htmlLang);
    });
  }
}
