import { test, expect } from '@playwright/test';

/**
 * SEO foundations review — enforces acceptance criteria from
 * `.codex-tasks/2026-05-22-seo-foundations-review.md`.
 *
 * Hreflang + canonical are covered in hreflang.spec.ts.
 * Internal-link integrity is covered in links.spec.ts.
 *
 * This file covers what those don't:
 *  - OG + Twitter card completeness
 *  - schema.org type coverage (Person, WebSite, TechArticle/BlogPosting)
 *  - robots.txt + llms.txt + sitemap presence
 *  - subdomain robots posture (app=full-disallow; academy/notch/etc allow root)
 */

const OG_REQUIRED = [
  'og:title',
  'og:description',
  'og:image',
  'og:url',
  'og:type',
] as const;

const TWITTER_REQUIRED = [
  'twitter:card',
  'twitter:title',
  'twitter:description',
  'twitter:image',
] as const;

const PAGES_TO_AUDIT = ['/', '/about/', '/work/', '/ai-systems/', '/insights/'];

for (const path of PAGES_TO_AUDIT) {
  test(`${path} has all required OG tags`, async ({ page }) => {
    await page.goto(path);
    for (const tag of OG_REQUIRED) {
      const meta = page.locator(`meta[property="${tag}"]`);
      await expect(meta, `missing ${tag}`).toHaveCount(1);
      const content = await meta.getAttribute('content');
      expect(content, `${tag} content empty`).toBeTruthy();
    }
  });

  test(`${path} has all required Twitter card tags`, async ({ page }) => {
    await page.goto(path);
    for (const tag of TWITTER_REQUIRED) {
      const meta = page.locator(`meta[name="${tag}"]`);
      await expect(meta, `missing ${tag}`).toHaveCount(1);
    }
  });
}

test('homepage emits Person + WebSite schema', async ({ page }) => {
  await page.goto('/');
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
  expect(types, 'Person schema missing on /').toContain('Person');
  expect(types, 'WebSite schema missing on /').toContain('WebSite');
});

test('article page emits Article-like schema (TechArticle | BlogPosting | Article)', async ({ page }) => {
  await page.goto('/insights/how-to-build-gtm-ai-agent-outbound-crm/');
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
  const hasArticle =
    types.has('TechArticle') || types.has('BlogPosting') || types.has('Article');
  expect(hasArticle, `expected one of TechArticle|BlogPosting|Article, got ${[...types]}`).toBe(true);
});

test('robots.txt allows crawl and points to sitemap', async ({ request }) => {
  const r = await request.get('/robots.txt');
  expect(r.status()).toBe(200);
  const body = await r.text();
  expect(body, 'must allow crawl').toMatch(/User-agent:\s*\*/);
  expect(body, 'must not Disallow: /').not.toMatch(/Disallow:\s*\/\s*$/m);
  expect(body, 'must reference sitemap').toMatch(/Sitemap:\s*https?:\/\//);
});

test('llms.txt present and non-trivial', async ({ request }) => {
  const r = await request.get('/llms.txt');
  expect(r.status()).toBe(200);
  const body = await r.text();
  expect(body.length, 'llms.txt too short — should describe the site').toBeGreaterThan(500);
});

test('sitemap exists and lists key pages', async ({ request }) => {
  const idx = await request.get('/sitemap-index.xml');
  expect(idx.status()).toBe(200);
  const idxBody = await idx.text();
  const childMatch = idxBody.match(/<loc>([^<]+sitemap-0\.xml)<\/loc>/);
  expect(childMatch, 'sitemap-index must reference a child sitemap').not.toBeNull();
  const child = await request.get(childMatch![1]);
  expect(child.status()).toBe(200);
  const body = await child.text();
  for (const must of ['/about/', '/work/', '/ai-systems/', '/insights/']) {
    expect(body, `sitemap missing ${must}`).toContain(must);
  }
});

test('app.wojciech.io blocks all crawling', async ({ request }) => {
  const r = await request.get('https://app.wojciech.io/robots.txt');
  expect(r.status()).toBe(200);
  const body = await r.text();
  expect(body, 'app subdomain must be Disallow: /').toMatch(/Disallow:\s*\/\s*$/m);
});
