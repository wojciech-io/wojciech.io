import { test, expect } from '@playwright/test';

const EXPECTED_HOME_ALTERNATES = [
  ['x-default', 'https://wojciech.io/'],
  ['en', 'https://wojciech.io/'],
  ['de-DE', 'https://wojciech.io/de/'],
  ['da-DK', 'https://wojciech.io/dk/'],
  ['nb-NO', 'https://wojciech.io/no/'],
  ['ja-JP', 'https://wojciech.io/jp/'],
  ['it-IT', 'https://wojciech.io/it/'],
  ['es-ES', 'https://wojciech.io/es/'],
] as const;

const EXPECTED_ABOUT_ALTERNATES = [
  ['x-default', 'https://wojciech.io/about/'],
  ['en', 'https://wojciech.io/about/'],
  ['de-DE', 'https://wojciech.io/de/about/'],
  ['da-DK', 'https://wojciech.io/dk/about/'],
  ['nb-NO', 'https://wojciech.io/no/about/'],
  ['ja-JP', 'https://wojciech.io/jp/about/'],
  ['it-IT', 'https://wojciech.io/it/about/'],
  ['es-ES', 'https://wojciech.io/es/about/'],
] as const;

const EXPECTED_CV_ALTERNATES = [
  ['x-default', 'https://wojciech.io/cv/'],
  ['en', 'https://wojciech.io/cv/'],
  ['pl', 'https://wojciech.io/pl/cv/'],
  ['de-DE', 'https://wojciech.io/de/cv/'],
  ['da-DK', 'https://wojciech.io/dk/cv/'],
  ['nb-NO', 'https://wojciech.io/no/cv/'],
  ['ja-JP', 'https://wojciech.io/jp/cv/'],
  ['it-IT', 'https://wojciech.io/it/cv/'],
  ['es-ES', 'https://wojciech.io/es/cv/'],
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

test('localized content pages preserve the current page in hreflang alternates', async ({ page }) => {
  for (const [, href] of EXPECTED_ABOUT_ALTERNATES) {
    const path = new URL(href).pathname;
    await page.goto(path);

    const alternates = await page
      .locator('link[rel=alternate][hreflang]')
      .evaluateAll((links) =>
        links.map((link) => [
          link.getAttribute('hreflang'),
          link.getAttribute('href'),
        ]),
      );

    expect(alternates).toEqual(EXPECTED_ABOUT_ALTERNATES);
  }
});

test('CV pages emit the full localized CV hreflang set', async ({ page }) => {
  for (const [, href] of EXPECTED_CV_ALTERNATES) {
    const path = new URL(href).pathname;
    await page.goto(path);

    const alternates = await page
      .locator('link[rel=alternate][hreflang]')
      .evaluateAll((links) =>
        links.map((link) => [
          link.getAttribute('hreflang'),
          link.getAttribute('href'),
        ]),
      );

    expect(alternates).toEqual(EXPECTED_CV_ALTERNATES);
  }
});
