import { test, expect } from '@playwright/test';

const EXPECTED_HOME_ALTERNATES = [
  ['x-default', 'https://wojciech.io/'],
  ['en', 'https://wojciech.io/'],
  ['de-DE', 'https://wojciech.io/de/'],
  ['da-DK', 'https://wojciech.io/dk/'],
  ['nb-NO', 'https://wojciech.io/no/'],
  ['ja-JP', 'https://wojciech.io/jp/'],
] as const;

test('canonical on EN page points to root (never /en/)', async ({ page }) => {
  await page.goto('/about/');
  const canonical = await page.locator('link[rel=canonical]').getAttribute('href');
  expect(canonical).toMatch(/wojciech\.io\/about\/?$/);
  expect(canonical).not.toMatch(/\/en\//);
});

test('homepage emits localized home hreflang alternates', async ({ page }) => {
  await page.goto('/');

  const alternates = await page
    .locator('link[rel=alternate][hreflang]')
    .evaluateAll((links) =>
      links.map((link) => [
        link.getAttribute('hreflang'),
        link.getAttribute('href'),
      ]),
    );

  expect(alternates).toEqual(EXPECTED_HOME_ALTERNATES);
});

test('localized home pages point back to the same alternate set', async ({ page }) => {
  for (const [, href] of EXPECTED_HOME_ALTERNATES.filter(([lang]) => lang !== 'x-default' && lang !== 'en')) {
    const localizedPath = new URL(href).pathname;
    await page.goto(localizedPath);

    const alternates = await page
      .locator('link[rel=alternate][hreflang]')
      .evaluateAll((links) =>
        links.map((link) => [
          link.getAttribute('hreflang'),
          link.getAttribute('href'),
        ]),
      );

    expect(alternates).toEqual(EXPECTED_HOME_ALTERNATES);
  }
});
