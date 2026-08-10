import { beforeAll, describe, expect, it } from 'vitest';
import { assetExists, html, requireDist, text } from './helpers';

/**
 * Favicon, web app manifest, and feed autodiscovery audit.
 * Ported from tests/e2e/meta-assets.spec.ts.
 *
 * Catches regressions where a <link> points at a file that no longer exists,
 * the webmanifest loses required fields, or feed autodiscovery gets dropped.
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

interface Manifest {
  name?: string;
  short_name?: string;
  start_url?: string;
  icons?: Array<{ src: string; sizes?: string }>;
}

const manifest = (): Manifest => JSON.parse(text('/site.webmanifest')) as Manifest;

describe('favicons, manifest and feed autodiscovery', () => {
  beforeAll(requireDist);

  it('all favicon assets are built', () => {
    const missing = FAVICON_ASSETS.filter((p) => !assetExists(p));
    expect(missing, 'missing favicon assets').toEqual([]);
  });

  it('site.webmanifest is valid JSON with required fields', () => {
    const m = manifest();
    expect(m.name, 'missing name').toBeTruthy();
    expect(m.short_name, 'missing short_name').toBeTruthy();
    expect(m.start_url, 'missing start_url').toBe('/');
    expect(Array.isArray(m.icons), 'icons must be an array').toBe(true);
    expect(m.icons!.length, 'must have at least 2 icons').toBeGreaterThanOrEqual(2);
    for (const icon of m.icons!) {
      expect(icon.src, 'icon missing src').toBeTruthy();
      expect(icon.sizes, 'icon missing sizes').toBeTruthy();
    }
  });

  it('every webmanifest icon file exists', () => {
    const missing = (manifest().icons ?? [])
      .map((i) => (i.src.startsWith('/') ? i.src : `/${i.src}`))
      .filter((p) => !assetExists(p));
    expect(missing, 'broken webmanifest icon references').toEqual([]);
  });

  it('homepage head has RSS autodiscovery for the insights feed', () => {
    // The site exposes several feeds (insights /rss.xml, changelog /changelog.rss).
    // At least one must exist, and the canonical insights feed must be among them.
    const hrefs = [...html('/').matchAll(/<link[^>]*type="application\/rss\+xml"[^>]*>/gi)]
      .map(([tag]) => tag.match(/href="([^"]*)"/i)?.[1] ?? '');
    expect(hrefs.length, 'RSS autodiscovery link missing').toBeGreaterThan(0);
    expect(
      hrefs.find((h) => /\/rss\.xml$/.test(h)),
      `insights /rss.xml autodiscovery missing — found: ${hrefs.join(', ')}`,
    ).toBeTruthy();
  });

  it('homepage head links the webmanifest', () => {
    const tags = [...html('/').matchAll(/<link[^>]*rel="manifest"[^>]*>/gi)];
    expect(tags.length, '<link rel="manifest"> missing').toBe(1);
    expect(tags[0][0].match(/href="([^"]*)"/i)?.[1], 'manifest href').toMatch(/site\.webmanifest/);
  });
});
