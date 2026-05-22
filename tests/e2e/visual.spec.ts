// Tier 5a — Visual regression baseline
//
// Scaffolded in Sprint 1. All tests SKIPPED until baseline capture run.
//
// To activate (Sprint 2 owner: Test Engineer):
// 1. Make sure homepage + key pages have stable, real content
// 2. Run locally against prod or preview: `npx playwright test visual --update-snapshots`
// 3. Commit the generated `__screenshots__/` directory
// 4. Remove the `.skip` from each test below
// 5. PR with the baselines so CI starts running real diffs
//
// Threshold rationale: 0.1 maxDiffPixelRatio is lenient initially. Tighten to 0.02
// after 2-3 weeks of stable runs. Mask any animated/dynamic regions (live counters,
// recent-activity sections) with `mask: [page.locator(...)]`.
//
// Why a separate spec file: visual specs run slower and are environment-sensitive
// (font rendering varies between local macOS and Linux CI). Keeping them apart from
// smoke.spec.ts lets us run smoke fast on every PR while visual runs nightly.

import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'work', path: '/work' },
  { name: 'ai-systems', path: '/ai-systems' },
  { name: 'insights', path: '/insights' },
];

for (const viewport of VIEWPORTS) {
  for (const page of PAGES) {
    test.skip(`visual: ${page.name} @ ${viewport.name} (TODO: capture baseline in Sprint 2)`, async ({ page: pwPage }) => {
      await pwPage.setViewportSize({ width: viewport.width, height: viewport.height });
      await pwPage.goto(page.path);
      await pwPage.waitForLoadState('networkidle');

      await expect(pwPage).toHaveScreenshot(`${page.name}-${viewport.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.1,
        animations: 'disabled',
      });
    });
  }
}
