import { test, expect } from '@playwright/test';

/**
 * Per-page reachability + SEO surface assets.
 *
 * Complements smoke.spec.ts (which only covers EN main pages) by adding
 * supporting pages + the SEO/feed surface.
 *
 * DE/DK/NO/JP routes are active. Legacy PL/IT/EN prefixes intentionally
 * redirect to root because they are not published locales.
 */

const PAGES = [
  { path: '/contact/', name: 'contact' },
  { path: '/cv/', name: 'cv' },
  { path: '/now/', name: 'now' },
  { path: '/resources/', name: 'resources' },
];

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4321';
const IS_PROD = BASE_URL.includes('wojciech.io');

const archivedInsightSlugs = [
  'ai-adoption-framework-b2b-saas-growth-teams',
  'astro-cloudflare-pages-portfolio-ai-workflow',
  'b2b-crm-revenue-operations-system-guide',
  'b2b-revenue-system-design-operator-framework',
  'b2b-saas-growth-system-icp-acquisition-retention',
  'cloudflare-migration-zero-trust-free-tier',
  'component-showcase',
  'framer-to-astro-build-vs-buy-website-rebuild',
  'google-ads-ai-management-dashboard-guide',
  'gtm-ai-agent-four-layer-architecture-guide',
  'gtm-tools-build-vs-buy-decision-framework',
  'how-to-build-booking-engine-product-architecture',
  'how-to-build-gtm-ai-agent-outbound-crm',
  'how-to-build-micro-saas-with-ai-tools',
  'macos-teleprompter-macbook-notch-native-app',
] as const;

const redirectCases = [
  { from: '/pl/about/', to: '/' },
  { from: '/it/work/', to: '/' },
  { from: '/en/insights/', to: '/' },
  { from: '/blog/claude-code-vs-clay/', to: '/insights/claude-code-vs-clay/' },
  { from: '/blog/example-legacy-slug/', to: '/insights/example-legacy-slug/' },
  ...archivedInsightSlugs.map((slug) => ({
    from: `/insights/${slug}/`,
    to: '/insights/',
  })),
] as const;

const pathnameForLocation = (location: string) => new URL(location, BASE_URL).pathname;

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

test('rss feed is valid xml with required channel elements', async ({ request }) => {
  const r = await request.get('/rss.xml');
  expect(r.status()).toBe(200);
  const body = await r.text();
  expect(body).toMatch(/<rss|<feed/);
  expect(body).toContain('<title>');
  expect(body).toContain('<link>');
  expect(body).toContain('<item>');
});

test('rss feed items include <category> tags', async ({ request }) => {
  const r = await request.get('/rss.xml');
  expect(r.status()).toBe(200);
  const body = await r.text();
  expect(body).toContain('<category>');
});

test('json feed is valid and contains required fields', async ({ request }) => {
  const r = await request.get('/feed.json');
  expect(r.status()).toBe(200);
  expect(r.headers()['content-type']).toContain('application/feed+json');
  const feed = await r.json();
  expect(feed.version).toBe('https://jsonfeed.org/version/1.1');
  expect(feed.title).toBeTruthy();
  expect(feed.home_page_url).toMatch(/^https?:\/\//);
  expect(feed.feed_url).toMatch(/\/feed\.json$/);
  expect(Array.isArray(feed.items)).toBe(true);
  expect(feed.items.length, 'feed must have at least one item').toBeGreaterThan(0);
  const item = feed.items[0];
  expect(item.id).toBeTruthy();
  expect(item.url).toMatch(/\/insights\//);
  expect(item.title).toBeTruthy();
  expect(item.date_published).toMatch(/^\d{4}-\d{2}-\d{2}T/);
});

test('legacy /blog/* redirect lands on a live insights article (prod only)', async ({
  page,
}) => {
  test.skip(!IS_PROD, 'CF _redirects is not applied by astro preview');

  const resp = await page.goto('/blog/claude-code-vs-clay/');
  expect(resp?.status()).toBe(200);
  expect(page.url()).toMatch(/\/insights\//);
  const robots = page.locator('meta[name=robots]');
  if (await robots.count()) {
    const content = (await robots.getAttribute('content')) || '';
    expect(content).not.toMatch(/noindex/i);
  }
});

test.describe('Cloudflare Pages _redirects rules (prod only)', () => {
  test.skip(!IS_PROD, 'CF _redirects is not applied by astro preview');

  for (const { from, to } of redirectCases) {
    test(`${from} redirects to ${to}`, async ({ request }) => {
      const response = await request.get(from, {
        failOnStatusCode: false,
        maxRedirects: 0,
        timeout: 5_000,
      });

      expect(response.status(), `${from} status`).toBe(301);
      const location = response.headers().location;
      expect(location, `${from} Location header`).toBeTruthy();
      expect(pathnameForLocation(location!), `${from} Location`).toBe(to);
    });
  }
});
