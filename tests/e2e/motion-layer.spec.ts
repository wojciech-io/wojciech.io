import { test, expect } from '@playwright/test';

/**
 * Shared motion layer (/revolution/assets/motion).
 * 1. Reduced motion: nothing waits for a scroll, nothing runs.
 * 2. The data-m patterns (draw, words, scene) do what motion.js documents.
 */

const PAGES = ['/revolution/', '/revolution/gtm.html', '/revolution/marketing.html', '/revolution/growth.html'];

for (const path of PAGES) {
  test(`reduced motion shows every data-m block at once: ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    const res = await page.evaluate(() => {
      const hidden = [...document.querySelectorAll('[data-m]')].filter(
        (el) => parseFloat(getComputedStyle(el).opacity) < 0.1 || getComputedStyle(el).visibility === 'hidden',
      ).length;
      const running = document.getAnimations().filter((a) => a.playState === 'running' && a.effect && (a.effect as KeyframeEffect).target?.closest?.('[data-m]')).length;
      return { hidden, running, on: document.documentElement.classList.contains('m-on') };
    });
    expect(res.on).toBe(false);
    expect(res.hidden).toBe(0);
    expect(res.running).toBe(0);
  });
}

const FIXTURE = `
<link rel="stylesheet" href="/revolution/assets/motion/motion.css">
<script src="/revolution/assets/motion/motion.js"></script>
<body style="margin:0;font:16px sans-serif">
<div style="height:200px"></div>
<h2 data-m="words" id="w">Pick what is <em>broken</em> first</h2>
<div style="width:400px"><i id="d" data-m="draw" style="display:block;height:8px;background:#000;--v:50%"></i></div>
<svg width="100" height="20"><path id="p" data-m="draw" d="M0 10H100" stroke="#000" fill="none"/></svg>
<div style="height:600px"></div>
<section data-m="scene" id="s"><div class="m-pin">
  <div data-m-step><p>one</p></div><div data-m-step><p>two</p></div><div data-m-step><p>three</p></div>
  <nav><button data-m-tab>1</button><button data-m-tab>2</button><button data-m-tab>3</button></nav>
</div></section>
<div style="height:800px"></div></body>`;

async function fixture(page: import('@playwright/test').Page, reduce: boolean) {
  await page.emulateMedia({ reducedMotion: reduce ? 'reduce' : 'no-preference' });
  await page.goto('/revolution/gtm.html');
  await page.setContent(FIXTURE);
  await page.addStyleTag({ url: '/revolution/assets/motion/motion.css' });
  await page.addScriptTag({ url: '/revolution/assets/motion/motion.js' });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 100)));
}

test('words splits a heading, keeps tags and text', async ({ page }) => {
  await fixture(page, false);
  const out = await page.evaluate(() => {
    const h = document.getElementById('w')!;
    return { text: h.textContent, words: h.querySelectorAll('.m-wi').length, em: !!h.querySelector('em .m-wi') };
  });
  expect(out.text).toBe('Pick what is broken first');
  expect(out.words).toBe(5);
  expect(out.em).toBe(true);
});

test('draw grows a bar to --v and sets pathLength on SVG', async ({ page }) => {
  await fixture(page, false);
  expect(await page.evaluate(() => document.getElementById('p')!.getAttribute('pathLength'))).toBe('1');
  await page.locator('#d').scrollIntoViewIfNeeded();
  await expect(page.locator('#d')).toHaveClass(/m-in/);
  await page.waitForTimeout(1400);
  const w = await page.evaluate(() => document.getElementById('d')!.getBoundingClientRect().width);
  expect(Math.round(w)).toBe(200);
});

test('scene changes the visible step with scroll and tabs jump', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 });
  await fixture(page, false);
  const active = () => page.evaluate(() => [...document.querySelectorAll('[data-m-step]')].findIndex((e) => e.classList.contains('is-on')));
  await page.evaluate(() => document.getElementById('s')!.scrollIntoView());
  await expect.poll(active).toBe(0);
  await page.locator('[data-m-tab]').nth(2).click();
  await expect.poll(active).toBe(2);
  await page.locator('[data-m-tab]').nth(1).click();
  await expect.poll(active).toBe(1);
});

test('scene stacks all steps under reduced motion', async ({ page }) => {
  await fixture(page, true);
  const vis = await page.evaluate(() => [...document.querySelectorAll('[data-m-step]')].every((e) => getComputedStyle(e).visibility === 'visible' && getComputedStyle(e).opacity === '1'));
  expect(vis).toBe(true);
});
