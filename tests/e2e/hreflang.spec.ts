import { test, expect } from '@playwright/test';

/**
 * Hreflang + canonical correctness.
 *
 * Guards against the class of bugs Codex fixed in #ba6dc07 / #9bd1712:
 * - localized pages must emit en/pl/it/x-default
 * - EN-only articles must NOT emit PL/IT alternates (those URLs 404)
 * - canonical on EN page points to root (not /en/)
 * - og:locale matches html lang on localized pages
 */

test('localized pages have full hreflang cluster (en/pl/it/x-default)', async ({ page }) => {
  await page.goto('/about/');
  const langs = await page
    .locator('link[rel=alternate][hreflang]')
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('hreflang')));
  expect(langs.sort()).toEqual(['en', 'it', 'pl', 'x-default']);
});

test('EN-only article emits no PL/IT hreflang (would 404)', async ({ page }) => {
  await page.goto('/insights/how-to-build-gtm-ai-agent-outbound-crm/');
  const count = await page.locator('link[rel=alternate][hreflang]').count();
  expect(count, 'EN-only articles should have zero hreflang alternates').toBe(0);
});

test('og:locale matches html lang on PL page', async ({ page }) => {
  await page.goto('/pl/about/');
  const ogLocale = await page
    .locator('meta[property="og:locale"]')
    .getAttribute('content');
  expect(ogLocale).toBe('pl_PL');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
});

test('og:locale matches html lang on IT page', async ({ page }) => {
  await page.goto('/it/about/');
  const ogLocale = await page
    .locator('meta[property="og:locale"]')
    .getAttribute('content');
  expect(ogLocale).toBe('it_IT');
  await expect(page.locator('html')).toHaveAttribute('lang', 'it');
});

test('canonical on EN page points to root (never /en/)', async ({ page }) => {
  await page.goto('/about/');
  const canonical = await page.locator('link[rel=canonical]').getAttribute('href');
  expect(canonical).toMatch(/wojciech\.io\/about\/?$/);
  expect(canonical).not.toMatch(/\/en\//);
});
