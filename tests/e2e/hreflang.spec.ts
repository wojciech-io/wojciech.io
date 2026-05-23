import { test, expect } from '@playwright/test';

/**
 * Canonical correctness (post-Sprint-2-B1 — English-only launch).
 *
 * Multilingual hreflang tests removed Sprint 2 B1 along with /[lang]/, /pl/,
 * /it/ route directories. The original tests guarded against:
 *   - localized pages must emit en/pl/it/x-default (no localized pages now)
 *   - EN-only articles must NOT emit PL/IT alternates (always true now)
 *   - og:locale matches html lang on localized pages (no localized pages)
 *
 * Only the canonical-URL guard remains relevant.
 *
 * When a future localization sprint reinstates /[lang]/, restore the full
 * hreflang test suite from git history (commit ba6dc07 / 9bd1712 referenced
 * in the original docstring) and re-enable.
 */

test('canonical on EN page points to root (never /en/)', async ({ page }) => {
  await page.goto('/about/');
  const canonical = await page.locator('link[rel=canonical]').getAttribute('href');
  expect(canonical).toMatch(/wojciech\.io\/about\/?$/);
  expect(canonical).not.toMatch(/\/en\//);
});

test('homepage emits no hreflang alternates (English-only launch)', async ({ page }) => {
  await page.goto('/');
  const count = await page.locator('link[rel=alternate][hreflang]').count();
  expect(
    count,
    'English-only launch: no localized variants exist, so no hreflang alternates should emit',
  ).toBe(0);
});
