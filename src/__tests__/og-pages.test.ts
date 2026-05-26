import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { OG_PAGES, OG_PAGE_SLUGS } from '../data/og-pages';

const EXPECTED_SLUGS = ['about', 'work', 'ai-systems', 'contact', 'insights', 'now', 'resources', 'home'];

describe('OG_PAGES metadata', () => {
  it('covers exactly the expected set of page slugs', () => {
    expect(OG_PAGE_SLUGS.sort()).toEqual([...EXPECTED_SLUGS].sort());
  });

  it.each(EXPECTED_SLUGS)('%s: has a non-empty title', (slug) => {
    expect(OG_PAGES[slug].title.length, `${slug} title is empty`).toBeGreaterThan(5);
  });

  it.each(EXPECTED_SLUGS)('%s: has a non-empty eyebrow', (slug) => {
    expect(OG_PAGES[slug].eyebrow.length, `${slug} eyebrow is empty`).toBeGreaterThan(0);
  });

  it.each(EXPECTED_SLUGS)('%s: has a non-empty description', (slug) => {
    expect(OG_PAGES[slug].description.length, `${slug} description is empty`).toBeGreaterThan(20);
  });

  it.each(EXPECTED_SLUGS)('%s: title fits in OG image (≤90 chars)', (slug) => {
    expect(OG_PAGES[slug].title.length, `${slug} title too long for OG layout`).toBeLessThanOrEqual(90);
  });

  it.each(EXPECTED_SLUGS)('%s: description fits in OG image (≤120 chars)', (slug) => {
    expect(OG_PAGES[slug].description.length, `${slug} description too long for OG layout`).toBeLessThanOrEqual(120);
  });

  it('has no duplicate titles', () => {
    const titles = Object.values(OG_PAGES).map((m) => m.title);
    const unique = new Set(titles);
    expect(unique.size, 'duplicate titles found').toBe(titles.length);
  });

  it('uses the shared OG renderer for page and article images', () => {
    const pageRoute = readFileSync(
      new URL('../pages/og/pages/[page].png.ts', import.meta.url),
      'utf8',
    );
    const articleRoute = readFileSync(
      new URL('../pages/og/[slug].png.ts', import.meta.url),
      'utf8',
    );
    expect(pageRoute).toContain('renderOgImage');
    expect(articleRoute).toContain('renderOgImage');
    expect(pageRoute).not.toContain("from 'satori'");
    expect(articleRoute).not.toContain("from 'satori'");
  });
});
