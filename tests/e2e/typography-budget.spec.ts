import { test, expect } from '@playwright/test';

// Before the type roles (global.css, t-*), 14 pages rendered 103 distinct text
// styles between them. After: 12-21 per page on desktop. This fails a page that
// drifts past the budget, which is how the sprawl came back last time: one
// hand-tuned size or weight per component, each harmless on its own.
const BUDGET = 24;

const PAGES = [
  '/',
  '/about/',
  '/work/',
  '/insights/',
  '/insights/claude-code-vs-clay/',
  '/contact/',
  '/subscribe/',
  '/apps/notch/',
] as const;

for (const path of PAGES) {
  test(`type budget: ${path}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Measured once, at desktop width.');
    await page.route(/https:\/\/.*cal\.com\/.*/, (route) => route.abort());
    await page.goto(path, { waitUntil: 'domcontentloaded' });

    const styles = await page.evaluate(() => {
      const seen = new Map<string, string>();
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const text = node.textContent?.trim() ?? '';
        const el = node.parentElement;
        if (text.length < 2 || !el) continue;
        // Decorative text (aria-hidden), the wordmark, and illustration art
        // inside covers are drawings, not copy.
        if (el.closest('script,style,noscript,svg,[aria-hidden="true"],.wordmark-brand,[data-type-exempt]')) continue;
        const box = el.getBoundingClientRect();
        if (!box.width || !box.height) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden') continue;
        const key = [
          cs.fontFamily.includes('Mono') ? 'mono' : 'sans',
          `${Math.round(parseFloat(cs.fontSize) * 2) / 2}px`,
          cs.fontWeight,
          cs.letterSpacing,
          cs.textTransform,
        ].join(' ');
        if (!seen.has(key)) seen.set(key, text.slice(0, 40));
      }
      return [...seen.entries()].map(([k, v]) => `${k} "${v}"`);
    });

    expect(styles.length, `${path} renders ${styles.length} text styles:\n${styles.join('\n')}`).toBeLessThanOrEqual(BUDGET);
  });
}
