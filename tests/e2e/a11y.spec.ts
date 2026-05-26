import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility baseline.
 * Serious and critical axe findings block CI.
 * Reduced motion is forced so the scanner evaluates final contrast rather
 * than transient opacity during reveal animations.
 */

const BLOCKING_MIN_IMPACT: 'minor' | 'moderate' | 'serious' | 'critical' = 'serious';

const PAGES = [
  '/',
  '/about/',
  '/work/',
  '/ai-systems/',
  '/insights/',
  '/contact/',
  '/now/',
  '/resources/',
  '/de/',
  '/dk/',
  '/no/',
  '/jp/',
] as const;

for (const path of PAGES) {
  test(`a11y blocking scan: ${path}`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      // Cal.com renders a third-party booking iframe with its own theme and
      // contrast rules. Keep the host page blocking, but do not fail our CI
      // on UI we cannot patch from this repo.
      .exclude('#cal-inline iframe')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Attach full results to the test report regardless of pass/fail.
    await testInfo.attach('axe-results.json', {
      body: JSON.stringify(results, null, 2),
      contentType: 'application/json',
    });

    const blocking = results.violations.filter((v) =>
      impactAtLeast(v.impact, BLOCKING_MIN_IMPACT),
    );
    expect(blocking, `axe blocking violations on ${path}`).toEqual([]);
  });
}

const ORDER = ['minor', 'moderate', 'serious', 'critical'] as const;
function impactAtLeast(actual: string | null | undefined, min: (typeof ORDER)[number]) {
  if (!actual) return false;
  return ORDER.indexOf(actual as (typeof ORDER)[number]) >= ORDER.indexOf(min);
}
