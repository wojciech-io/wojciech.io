import { test, expect } from '@playwright/test';

/**
 * Favicon, web app manifest, and feed autodiscovery audit.
 *
 * Catches regressions where a <link> tag points to a file that no longer
 * exists, the webmanifest loses required fields, or feed autodiscovery links
 * get dropped.
 */

const FAVICON_ASSETS = [
  '/favicon.svg',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/favicon-64x64.png',
  '/favicon-192x192.png',
  '/favicon-512x512.png',
  '/apple-touch-icon.png',
] as const;

test('all favicon assets resolve (200)', async ({ request }) => {
  const broken: string[] = [];
  for (const path of FAVICON_ASSETS) {
    const r = await request.get(path, { failOnStatusCode: false });
    if (r.status() >= 400) broken.push(`${path} → ${r.status()}`);
  }
  expect(broken, 'broken favicon assets').toEqual([]);
});

test('site.webmanifest is valid JSON with required fields', async ({ request }) => {
  const r = await request.get('/site.webmanifest');
  expect(r.status()).toBe(200);
  const manifest = await r.json();
  expect(manifest.name, 'missing name').toBeTruthy();
  expect(manifest.short_name, 'missing short_name').toBeTruthy();
  expect(manifest.start_url, 'missing start_url').toBe('/');
  expect(Array.isArray(manifest.icons), 'icons must be an array').toBe(true);
  expect(manifest.icons.length, 'must have at least 2 icons').toBeGreaterThanOrEqual(2);
  for (const icon of manifest.icons) {
    expect(icon.src, 'icon missing src').toBeTruthy();
    expect(icon.sizes, 'icon missing sizes').toBeTruthy();
  }
});

test('webmanifest icon files all exist', async ({ request }) => {
  const r = await request.get('/site.webmanifest');
  const manifest = await r.json();
  const broken: string[] = [];
  for (const icon of manifest.icons ?? []) {
    const src: string = icon.src;
    const path = src.startsWith('/') ? src : `/${src}`;
    const ir = await request.get(path.split('?')[0], { failOnStatusCode: false });
    if (ir.status() >= 400) broken.push(`${path} → ${ir.status()}`);
  }
  expect(broken, 'broken webmanifest icon references').toEqual([]);
});

test('homepage <head> has RSS autodiscovery link', async ({ page }) => {
  await page.goto('/');
  const rssLink = page.locator('link[rel="alternate"][type="application/rss+xml"]');
  await expect(rssLink, 'RSS autodiscovery link missing').toHaveCount(1);
  const rssHref = await rssLink.getAttribute('href');
  expect(rssHref, 'RSS href must end in /rss.xml').toMatch(/\/rss\.xml$/);
});

test('homepage <head> includes <link rel="manifest"> pointing to webmanifest', async ({
  page,
}) => {
  await page.goto('/');
  const manifestLink = page.locator('link[rel="manifest"]');
  await expect(manifestLink, '<link rel="manifest"> missing').toHaveCount(1);
  const href = await manifestLink.getAttribute('href');
  expect(href, 'manifest href').toMatch(/site\.webmanifest/);
});
