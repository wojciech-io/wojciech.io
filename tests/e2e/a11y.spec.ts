import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility baseline.
 *
 * Sprint 1: warning-mode, collects violations, attaches to report, but does
 * NOT fail the build on serious findings until baseline is clean.
 * Sprint 2: flip to blocking on `serious` and `critical`.
 *
 * To flip to blocking, change BLOCKING_MIN_IMPACT to 'serious' below and the
 * assertion at the bottom from `console.warn` to `expect(...).toEqual([])`.
 */

const BLOCKING_MIN_IMPACT: 'minor' | 'moderate' | 'serious' | 'critical' | null = null;

const PAGES = ['/', '/about/', '/work/', '/ai-systems/', '/insights/'];

for (const path of PAGES) {
  test(`a11y baseline: ${path}`, async ({ page }, testInfo) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Attach full results to the test report regardless of pass/fail.
    await testInfo.attach('axe-results.json', {
      body: JSON.stringify(results, null, 2),
      contentType: 'application/json',
    });

    if (BLOCKING_MIN_IMPACT === null) {
      // Warning mode: log only, no assertions.
      const counts = results.violations.reduce(
        (acc, v) => ((acc[v.impact ?? 'unknown'] = (acc[v.impact ?? 'unknown'] ?? 0) + 1), acc),
        {} as Record<string, number>,
      );
      console.warn(`a11y ${path}: violations:`, counts);
    } else {
      const blocking = results.violations.filter((v) =>
        impactAtLeast(v.impact, BLOCKING_MIN_IMPACT),
      );
      expect(blocking, `axe blocking violations on ${path}`).toEqual([]);
    }
  });
}

const ORDER = ['minor', 'moderate', 'serious', 'critical'] as const;
function impactAtLeast(actual: string | null | undefined, min: (typeof ORDER)[number]) {
  if (!actual) return false;
  return ORDER.indexOf(actual as (typeof ORDER)[number]) >= ORDER.indexOf(min);
}
