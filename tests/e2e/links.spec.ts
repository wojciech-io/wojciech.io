import { test, expect } from '@playwright/test';

/**
 * Internal link audit.
 *
 * Catches broken /privacy links (historical CookieBanner bug) and any
 * regressions in cross-page navigation.
 *
 * PL/IT routes + lang-switcher tests removed Sprint 2 B1 (English-only
 * launch per CLAUDE.md). Re-add when localization sprint reinstates them.
 */

const PAGES_TO_AUDIT = ['/', '/about/', '/work/', '/ai-systems/', '/insights/', '/resources/'];

test('cookie banner /privacy link resolves (was 404 historically)', async ({ page }) => {
  await page.goto('/');
  const privacyLink = page.locator('a[href="/privacy"], a[href="/privacy/"]').first();
  if (await privacyLink.count()) {
    const href = await privacyLink.getAttribute('href');
    const r = await page.request.get(href!);
    expect(r.status(), 'privacy page must not 404').toBeLessThan(400);
  }
});

for (const path of PAGES_TO_AUDIT) {
  test(`internal links on ${path} resolve (cap 20)`, async ({ page, request }) => {
    await page.goto(path);
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((nodes) =>
      Array.from(
        new Set(
          nodes.map((n) => (n as HTMLAnchorElement).getAttribute('href') || ''),
        ),
      ),
    );
    const internal = hrefs
      .filter(
        (h) =>
          h &&
          !h.startsWith('//') &&
          !h.startsWith('/#') &&
          !h.startsWith('mailto:'),
      )
      .slice(0, 20);

    const broken: string[] = [];
    for (const href of internal) {
      const r = await request.get(href, { maxRedirects: 5, failOnStatusCode: false });
      if (r.status() >= 400) broken.push(`${href} → ${r.status()}`);
    }
    expect(broken, `broken links on ${path}`).toEqual([]);
  });
}
