import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { CARD_SIZES, coverImg, coverSources, FEATURED_SIZES, HERO_SIZES } from '../lib/coverSources';

const COVERS = resolve(process.cwd(), 'public/images/insights');
const isSource = (f: string) => f.endsWith('.webp') && !/-\d{3,4}\.webp$/.test(f);

describe('cover sources', () => {
  const sources = readdirSync(COVERS).filter(isSource).sort();

  it('finds covers to check', () => {
    expect(sources.length).toBeGreaterThan(50);
  });

  it('gives every cover an 800px twin, so cards never download a hero', () => {
    const missing = sources.filter((f) => !existsSync(resolve(COVERS, f.replace(/\.webp$/, '-800.webp'))));
    expect(missing, 'run node scripts/gen-cover-variants.mjs').toEqual([]);
  });

  it('lists widths in ascending order, which is what the browser picks from', () => {
    for (const file of sources) {
      const { srcset } = coverSources(`/images/insights/${file}`);
      expect(srcset, file).toBeTruthy();
      const widths = srcset!.split(', ').map((e) => Number(e.split(' ')[1].replace('w', '')));
      expect(widths, file).toEqual([...widths].sort((a, b) => a - b));
      expect(new Set(widths).size, `${file} repeats a width`).toBe(widths.length);
    }
  });

  it('reads the real width rather than assuming 1200', () => {
    // Nine covers are 1456px portrait art, not 1200x630 heroes.
    const all = sources.flatMap((f) => coverSources(`/images/insights/${f}`).srcset!.split(', '));
    const widths = new Set(all.map((e) => e.split(' ')[1]));
    expect(widths.has('800w')).toBe(true);
    expect(widths.has('1200w')).toBe(true);
    expect(widths.has('1456w')).toBe(true);
  });

  it('keeps the content hash on every candidate', () => {
    const { src, srcset } = coverSources(`/images/insights/${sources[0]}`);
    expect(src).toMatch(/\?v=[0-9a-f]{8}$/);
    for (const entry of srcset!.split(', ')) expect(entry).toMatch(/\?v=[0-9a-f]{8} \d+w$/);
  });

  it('leaves srcset off when there is nothing to choose between', () => {
    expect(coverSources('/images/insights/does-not-exist.webp').srcset).toBeUndefined();
    expect(coverSources(undefined).srcset).toBeUndefined();
  });
});

describe('coverImg', () => {
  it('drops sizes when there is no srcset, because sizes alone does nothing', () => {
    expect(coverImg('/images/insights/does-not-exist.webp', CARD_SIZES).sizes).toBeUndefined();
  });

  it('carries sizes through when there is a choice to make', () => {
    const file = readdirSync(COVERS).filter(isSource).sort()[0];
    expect(coverImg(`/images/insights/${file}`, CARD_SIZES).sizes).toBe(CARD_SIZES);
  });

  it('never offers a slot wider than the content grid', () => {
    for (const sizes of [CARD_SIZES, FEATURED_SIZES, HERO_SIZES]) {
      const px = [...sizes.matchAll(/ (\d+)px,/g)].map((m) => Number(m[1]));
      for (const v of px) expect(v).toBeLessThanOrEqual(1104);
    }
  });
});
