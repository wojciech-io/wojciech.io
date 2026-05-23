import { test, expect } from '@playwright/test';

/**
 * Per-page reachability + SEO surface assets.
 *
 * Complements smoke.spec.ts (which only covers EN main pages) by adding
 * supporting pages + the SEO/feed surface.
 *
 * PL/IT routes removed Sprint 2 B1 (English-only launch per CLAUDE.md).
 * Re-add localized paths here when a dedicated localization sprint reinstates
 * /[lang]/ + /pl/ + /it/ in src/pages/.
 */

const PAGES = [
  { path: '/contact/', name: 'contact' },
  { path: '/cv/', name: 'cv' },
];

for (const p of PAGES) {
  test(`${p.name} returns 200 + has h1`, async ({ page }) => {
    const resp = await page.goto(p.path);
    expect(resp?.status(), `${p.path} status`).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });
}

test('sitemap-index.xml is served', async ({ request }) => {
  const r = await request.get('/sitemap-index.xml');
  expect(r.status()).toBe(200);
  expect(await r.text()).toContain('<sitemapindex');
});

test('robots.txt references sitemap', async ({ request }) => {
  const r = await request.get('/robots.txt');
  expect(r.status()).toBe(200);
  expect((await r.text()).toLowerCase()).toContain('sitemap');
});

test('llms.txt is served', async ({ request }) => {
  const r = await request.get('/llms.txt');
  expect(r.status()).toBe(200);
});

test('rss feed is valid xml', async ({ request }) => {
  const r = await request.get('/rss.xml');
  expect(r.status()).toBe(200);
  expect(await r.text()).toMatch(/<rss|<feed/);
});

test('legacy /blog/* redirect lands on a live insights article (prod only)', async ({
  page,
}) => {
  const isProd = (process.env.BASE_URL || '').includes('wojciech.io');
  test.skip(!isProd, 'CF _redirects is not applied by astro preview');

  const resp = await page.goto('/blog/claude-code-vs-clay/');
  expect(resp?.status()).toBe(200);
  expect(page.url()).toMatch(/\/insights\//);
  const robots = page.locator('meta[name=robots]');
  if (await robots.count()) {
    const content = (await robots.getAttribute('content')) || '';
    expect(content).not.toMatch(/noindex/i);
  }
});
