// Tier 5a — Visual regression baseline
//
// Threshold rationale: 0.1 maxDiffPixelRatio is lenient initially. Tighten to 0.02
// after 2-3 weeks of stable runs. Mask animated/dynamic regions (live counters,
// recent-activity sections, auto-advancing sliders) with `mask: [page.locator(...)]`.
//
// Why a separate spec file: visual specs run slower and are environment-sensitive
// (font rendering varies between local macOS and Linux CI). Keeping them apart from
// smoke.spec.ts lets us run smoke fast on every PR while visual runs nightly.

import { test, expect } from '@playwright/test';

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Visual baselines are captured in Chromium only.');
});

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
    test(`visual: ${page.name} @ ${viewport.name}`, async ({ page: pwPage }) => {
      await pwPage.setViewportSize({ width: viewport.width, height: viewport.height });
      await pwPage.goto(page.path);
      await pwPage.waitForLoadState('networkidle');

      await expect(pwPage).toHaveScreenshot(`${page.name}-${viewport.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.1,
        animations: 'disabled',
        mask: [pwPage.locator('#testimonial-slider-mobile')],
      });
    });
  }
}
