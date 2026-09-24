// Proof, not a gate.
//
// visual.spec.ts compares against committed baselines and only has macOS ones,
// so it never runs on CI. Full visual regression is also the wrong tool while
// the site is being actively redesigned: every intentional change would fail
// the build, and a check that cries wolf gets ignored.
//
// This spec asserts nothing. It captures the same pages and viewports and
// leaves them as a CI artifact, so a reviewer can look at what a pull request
// actually renders instead of taking the description's word for it. The
// newsletter's own operator note for this is "agent review moves from
// screenshots and vibes to traces" — this is the screenshot half, made
// automatic rather than asked for.

import { test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const OUT = 'page-screenshots';

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
  { name: 'contact', path: '/contact' },
  { name: 'insights', path: '/insights' },
];

test.describe.configure({ mode: 'serial' });

test.beforeEach(({}, testInfo) => {
  // One browser is enough for a look; three would triple the artifact for nothing.
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Screenshots are captured in Chromium only.');
});

for (const viewport of VIEWPORTS) {
  for (const page of PAGES) {
    test(`screenshot: ${page.name} @ ${viewport.name}`, async ({ page: pwPage }) => {
      await mkdir(OUT, { recursive: true });
      await pwPage.setViewportSize({ width: viewport.width, height: viewport.height });
      await pwPage.goto(page.path);
      await pwPage.waitForLoadState('networkidle');

      // Cards carry loading="lazy", and a fullPage screenshot does not scroll,
      // so everything below the fold stays unloaded and the capture shows empty
      // placeholder cards. The first run of this spec produced exactly that and
      // looked like a site-wide regression. Walk the page first, then let the
      // images that started loading finish.
      await pwPage.evaluate(async () => {
        const step = window.innerHeight;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, 0);
      });
      await pwPage.waitForLoadState('networkidle');
      // The reveal animations settle well inside this; without it the capture
      // catches sections mid-fade and every screenshot looks broken.
      await pwPage.waitForTimeout(600);
      await pwPage.screenshot({
        path: `${OUT}/${page.name}-${viewport.name}.png`,
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
}
