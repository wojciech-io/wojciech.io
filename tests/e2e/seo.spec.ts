import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

/**
 * SEO foundations review.
 *
 * Hreflang is covered in hreflang.spec.ts.
 * Internal-link integrity is covered in links.spec.ts.
 *
 * This file covers what those don't:
 *  - canonical URL coverage for public pages
 *  - OG + Twitter card completeness
 *  - OG/Twitter image resolvability
 *  - schema.org type coverage (Person, WebSite, BlogPosting)
 *  - robots.txt + llms.txt + sitemap presence
 *  - app subdomain robots posture (full disallow)
 */

const OG_REQUIRED = [
  'og:title',
  'og:description',
  'og:image',
  'og:image:alt',
  'og:url',
  'og:type',
] as const;

const TWITTER_REQUIRED = [
  'twitter:card',
  'twitter:title',
  'twitter:description',
  'twitter:image',
  'twitter:image:alt',
] as const;

const PAGES_TO_AUDIT = [
  '/',
  '/about/',
  '/work/',
  '/ai-systems/',
  '/insights/',
  '/contact/',
  '/now/',
  '/resources/',
] as const;
const INDEXABLE_SITEMAP_PATHS = [
  '/',
  '/about/',
  '/ai-systems/',
  '/contact/',
  '/insights/',
  '/now/',
  '/resources/',
  '/work/',
  '/de/',
  '/de/about/',
  '/de/work/',
  '/de/ai-systems/',
  '/de/contact/',
  '/dk/',
  '/dk/about/',
  '/dk/work/',
  '/dk/ai-systems/',
  '/dk/contact/',
  '/no/',
  '/no/about/',
  '/no/work/',
  '/no/ai-systems/',
  '/no/contact/',
  '/jp/',
  '/jp/about/',
  '/jp/work/',
  '/jp/ai-systems/',
  '/jp/contact/',
  '/pl/insights/',
] as const;
// /apps/ is in noindexSitemapPaths in astro.config.mjs — excluded by design.
// /subscribe/ removed: page deleted, 301 redirect to subscribe.wojciech.io.
// Note: locale roots like /de/, /pl/, /it/ ARE indexable now that articles exist for them.
// /en/ stays excluded because canonical EN URLs omit the prefix (e.g. /insights/<slug>/).
const NON_INDEXABLE_SITEMAP_PATHS = ['/404/', '/cv/', '/privacy/', '/en/', '/apps/'] as const;

const siteUrlForPath = (path: string) => `https://wojciech.io${path}`;
const sameOriginPath = (absoluteUrl: string) => new URL(absoluteUrl).pathname;

for (const path of PAGES_TO_AUDIT) {
  test(`${path} has the expected canonical URL`, async ({ page }) => {
    await page.goto(path);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical, 'missing canonical link').toHaveCount(1);
    await expect(canonical).toHaveAttribute('href', siteUrlForPath(path));
  });

  test(`${path} has all required OG tags`, async ({ page }) => {
    await page.goto(path);
    for (const tag of OG_REQUIRED) {
      const meta = page.locator(`meta[property="${tag}"]`);
      await expect(meta, `missing ${tag}`).toHaveCount(1);
      const content = await meta.getAttribute('content');
      expect(content, `${tag} content empty`).toBeTruthy();
    }
  });

  test(`${path} OG image resolves locally`, async ({ page, request }) => {
    await page.goto(path);
    const content = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(content, 'og:image content empty').toBeTruthy();

    const r = await request.get(sameOriginPath(content!), { failOnStatusCode: false });
    expect(r.status(), `${content} must resolve`).toBeLessThan(400);
  });

  test(`${path} has all required Twitter card tags`, async ({ page }) => {
    await page.goto(path);
    for (const tag of TWITTER_REQUIRED) {
      const meta = page.locator(`meta[name="${tag}"]`);
      await expect(meta, `missing ${tag}`).toHaveCount(1);
      const content = await meta.getAttribute('content');
      expect(content, `${tag} content empty`).toBeTruthy();
    }
  });

  test(`${path} Twitter image resolves locally`, async ({ page, request }) => {
    await page.goto(path);
    const content = await page.locator('meta[name="twitter:image"]').getAttribute('content');
    expect(content, 'twitter:image content empty').toBeTruthy();

    const r = await request.get(sameOriginPath(content!), { failOnStatusCode: false });
    expect(r.status(), `${content} must resolve`).toBeLessThan(400);
  });
}

test('/about emits Person schema', async ({ page }) => {
  await page.goto('/about/');
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = new Set<string>();
  for (const raw of scripts) {
    try {
      const j = JSON.parse(raw);
      const items = Array.isArray(j) ? j : [j];
      for (const it of items) if (it['@type']) types.add(it['@type']);
    } catch {
      /* ignore malformed; another assertion catches it */
    }
  }
  expect(types, 'Person schema missing on /about/').toContain('Person');
});

test('homepage emits WebSite schema', async ({ page }) => {
  await page.goto('/');
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = new Set<string>();
  for (const raw of scripts) {
    try {
      const j = JSON.parse(raw);
      const items = Array.isArray(j) ? j : [j];
      for (const it of items) if (it['@type']) types.add(it['@type']);
    } catch {
      /* ignore */
    }
  }
  expect(types, 'WebSite schema missing on /').toContain('WebSite');
});

test('published insight pages emit BlogPosting schema when articles exist', async ({ page }) => {
  await page.goto('/insights/');
  const articleHref = await page
    .locator('a[href^="/insights/"]')
    .evaluateAll((links) =>
      links
        .map((link) => (link as HTMLAnchorElement).getAttribute('href') ?? '')
        .find((href) => /^\/insights\/[^/]+\/$/.test(href)),
    );

  test.skip(!articleHref, 'No published insights exist in this checkout.');

  await page.goto(articleHref!);
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = new Set<string>();
  for (const raw of scripts) {
    try {
      const j = JSON.parse(raw);
      const items = Array.isArray(j) ? j : [j];
      for (const it of items) if (it['@type']) types.add(it['@type']);
    } catch {
      /* ignore */
    }
  }

  expect(types, `expected BlogPosting schema, got ${[...types]}`).toContain('BlogPosting');
});

test('robots.txt allows crawl and points to sitemap', async ({ request }) => {
  const r = await request.get('/robots.txt');
  expect(r.status()).toBe(200);
  const body = await r.text();
  expect(body, 'must allow crawl').toMatch(/User-agent:\s*\*/);
  expect(body, 'must not Disallow: /').not.toMatch(/Disallow:\s*\/\s*$/m);
  expect(body, 'must reference sitemap').toMatch(/Sitemap:\s*https?:\/\//);
});

test('app subdomain robots file blocks all crawling', async () => {
  const body = await readFile(
    new URL('../../apps/app/public/robots.txt', import.meta.url),
    'utf8',
  );
  expect(body).toMatch(/User-agent:\s*\*/);
  expect(body).toMatch(/Disallow:\s*\/\s*$/m);
});

test('llms.txt present and non-trivial', async ({ request }) => {
  const r = await request.get('/llms.txt');
  expect(r.status()).toBe(200);
  const body = await r.text();
  expect(body.length, 'llms.txt too short: should describe the site').toBeGreaterThan(500);
});

test('sitemap exists and lists key pages', async ({ request }) => {
  const idx = await request.get('/sitemap-index.xml');
  expect(idx.status()).toBe(200);
  const idxBody = await idx.text();
  const childMatch = idxBody.match(/<loc>([^<]+sitemap-0\.xml)<\/loc>/);
  expect(childMatch, 'sitemap-index must reference a child sitemap').not.toBeNull();
  const child = await request.get(sameOriginPath(childMatch![1]));
  expect(child.status()).toBe(200);
  const body = await child.text();

  for (const must of INDEXABLE_SITEMAP_PATHS) {
    expect(body, `sitemap missing ${must}`).toContain(`<loc>${siteUrlForPath(must)}</loc>`);
  }

  for (const mustNot of NON_INDEXABLE_SITEMAP_PATHS) {
    expect(body, `sitemap should not list ${mustNot}`).not.toContain(
      `<loc>${siteUrlForPath(mustNot)}</loc>`,
    );
  }

  expect(body, 'sitemap must not list dev subdomain').not.toContain('dev.wojciech.io');
  expect(body, 'sitemap must not list app subdomain').not.toContain('app.wojciech.io');
});

test('sitemap contains at least one published article URL', async ({ request }) => {
  const idx = await request.get('/sitemap-index.xml');
  const idxBody = await idx.text();
  const childMatch = idxBody.match(/<loc>([^<]+sitemap-0\.xml)<\/loc>/);
  expect(childMatch, 'sitemap-index must reference a child sitemap').not.toBeNull();
  const child = await request.get(sameOriginPath(childMatch![1]));
  const body = await child.text();
  expect(body, 'sitemap must contain at least one /insights/<slug>/ article URL').toMatch(
    /\/insights\/[^/]+\//,
  );
});
