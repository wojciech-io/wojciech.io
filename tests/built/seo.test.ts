import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { assetExists, html, linkHref, meta, requireDist, schemaTypes, text } from './helpers';

/**
 * SEO foundations, ported from tests/e2e/seo.spec.ts.
 *
 * Hreflang lives in hreflang.test.ts. Internal-link integrity stays in
 * tests/e2e/links.spec.ts, which needs a served site.
 *
 * Covered here: canonical coverage, OG + Twitter completeness and image
 * resolvability, schema.org type coverage, robots/llms/sitemap.
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
  '/', '/about/', '/ai-systems/', '/contact/', '/insights/', '/now/', '/resources/', '/work/',
  '/de/', '/de/about/', '/de/work/', '/de/ai-systems/', '/de/contact/',
  '/dk/', '/dk/about/', '/dk/work/', '/dk/ai-systems/', '/dk/contact/',
  '/no/', '/no/about/', '/no/work/', '/no/ai-systems/', '/no/contact/',
  '/jp/', '/jp/about/', '/jp/work/', '/jp/ai-systems/', '/jp/contact/',
  '/pl/insights/',
] as const;

// /apps/ is in noindexSitemapPaths in astro.config.mjs — excluded by design.
// /en/ stays excluded because canonical EN URLs omit the prefix.
const NON_INDEXABLE_SITEMAP_PATHS = ['/404/', '/cv/', '/privacy/', '/en/', '/apps/'] as const;

const siteUrlForPath = (path: string) => `https://wojciech.io${path}`;
const sameOriginPath = (absoluteUrl: string) => new URL(absoluteUrl).pathname;

describe('SEO foundations', () => {
  beforeAll(requireDist);

  for (const path of PAGES_TO_AUDIT) {
    describe(path, () => {
      it('has the expected canonical URL', () => {
        expect(linkHref(html(path), 'canonical'), 'missing canonical link').toBe(
          siteUrlForPath(path),
        );
      });

      it('has all required OG tags', () => {
        const doc = html(path);
        for (const tag of OG_REQUIRED) {
          expect(meta(doc, tag), `${tag} missing or empty`).toBeTruthy();
        }
      });

      it('OG image resolves locally', () => {
        const content = meta(html(path), 'og:image');
        expect(content, 'og:image content empty').toBeTruthy();
        expect(assetExists(sameOriginPath(content!)), `${content} must resolve`).toBe(true);
      });

      it('has all required Twitter card tags', () => {
        const doc = html(path);
        for (const tag of TWITTER_REQUIRED) {
          expect(meta(doc, tag), `${tag} missing or empty`).toBeTruthy();
        }
      });

      it('Twitter image resolves locally', () => {
        const content = meta(html(path), 'twitter:image');
        expect(content, 'twitter:image content empty').toBeTruthy();
        expect(assetExists(sameOriginPath(content!)), `${content} must resolve`).toBe(true);
      });
    });
  }

  it('/about emits Person schema', () => {
    expect(schemaTypes(html('/about/')), 'Person schema missing on /about/').toContain('Person');
  });

  it('homepage emits WebSite schema', () => {
    expect(schemaTypes(html('/')), 'WebSite schema missing on /').toContain('WebSite');
  });

  it('published insight pages emit BlogPosting schema', () => {
    const index = html('/insights/');
    const href = [...index.matchAll(/href="(\/insights\/[^/"]+\/)"/g)].map((m) => m[1])[0];
    expect(href, 'no published insight article found in the build').toBeTruthy();
    expect(schemaTypes(html(href!)), `expected BlogPosting on ${href}`).toContain('BlogPosting');
  });

  it('robots.txt allows crawl and points to sitemap', () => {
    const body = text('/robots.txt');
    expect(body, 'must allow crawl').toMatch(/User-agent:\s*\*/);
    expect(body, 'must not Disallow: /').not.toMatch(/Disallow:\s*\/\s*$/m);
    expect(body, 'must reference sitemap').toMatch(/Sitemap:\s*https?:\/\//);
  });

  it('app subdomain robots file blocks all crawling', () => {
    const body = readFileSync(join(process.cwd(), 'apps/app/public/robots.txt'), 'utf8');
    expect(body).toMatch(/User-agent:\s*\*/);
    expect(body).toMatch(/Disallow:\s*\/\s*$/m);
  });

  it('llms.txt present and non-trivial', () => {
    expect(text('/llms.txt').length, 'llms.txt too short: should describe the site').toBeGreaterThan(500);
  });

  describe('sitemap', () => {
    const childBody = () => {
      const idx = text('/sitemap-index.xml');
      const child = idx.match(/<loc>([^<]+sitemap-0\.xml)<\/loc>/);
      expect(child, 'sitemap-index must reference a child sitemap').not.toBeNull();
      return text(sameOriginPath(child![1]));
    };

    it('lists key pages and excludes the rest', () => {
      const body = childBody();
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

    it('contains at least one published article URL', () => {
      expect(childBody(), 'sitemap must contain at least one /insights/<slug>/ URL').toMatch(
        /\/insights\/[^/]+\//,
      );
    });
  });
});
