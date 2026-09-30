import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { imageRungs, PROSE_SIZES, webpWidth } from '@wojciech/mdx-components/lib/imageRungs';

const CONTENT = resolve(process.cwd(), 'src/content/insights');
const IMAGES = resolve(process.cwd(), 'public/images/insights');

/** Every image an article renders in its body, however it was authored. */
function bodyImages(): string[] {
  const found = new Set<string>();
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = resolve(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name.endsWith('.mdx')) {
        for (const m of readFileSync(path, 'utf8').matchAll(/src="(\/images\/[^"]+\.webp)"/g)) found.add(m[1]);
      }
    }
  };
  walk(CONTENT);
  return [...found].sort();
}

describe('in-article image rungs', () => {
  const images = bodyImages();

  it('finds the images articles render', () => {
    expect(images.length).toBeGreaterThan(5);
  });

  it('gives every one a narrower copy to fall back to', () => {
    const bare = images.filter((src) => !imageRungs(src).srcset);
    expect(bare, 'run node scripts/gen-cover-variants.mjs').toEqual([]);
  });

  it('lists widths ascending and without repeats', () => {
    for (const src of images) {
      const widths = imageRungs(src).srcset!.split(', ').map((e) => Number(e.split(' ')[1].replace('w', '')));
      expect(widths, src).toEqual([...widths].sort((a, b) => a - b));
      expect(new Set(widths).size, `${src} repeats a width`).toBe(widths.length);
    }
  });

  it('never offers a rung as wide as or wider than the source', () => {
    for (const src of images) {
      const real = webpWidth(`${process.cwd()}/public${src}`)!;
      // Addresses carry a content hash, so the base entry is found by its path.
      const rungs = imageRungs(src)
        .srcset!.split(', ')
        .map((entry) => ({ path: entry.split('?')[0], w: Number(entry.split(' ')[1].replace('w', '')) }))
        .filter((entry) => entry.path !== src)
        .map((entry) => entry.w);
      for (const w of rungs) expect(w, `${src} offers ${w}w from a ${real}px source`).toBeLessThan(real);
    }
  });

  it('adds the 1500 rung only where the source is wide enough to need one', () => {
    const sources = readdirSync(IMAGES).filter((f) => f.endsWith('.webp') && !/-\d{3,4}\.webp$/.test(f));
    for (const file of sources) {
      const real = webpWidth(resolve(IMAGES, file))!;
      const has1500 = imageRungs(`/images/insights/${file}`).srcset?.includes('-1500.webp');
      if (real < 1800) expect(has1500, `${file} is ${real}px and needs no mid rung`).toBeFalsy();
    }
  });

  it('reads the true width rather than trusting the file name', () => {
    // This one declares width="1400" in the MDX and is 1400px on disk.
    expect(webpWidth(resolve(IMAGES, 'claude-fable-5-anthropic-benchmarks.webp'))).toBe(1400);
    expect(webpWidth(resolve(IMAGES, 'claude-fable-5-arena-prompt.webp'))).toBe(2360);
  });

  it('leaves both attributes off when there is nothing to choose between', () => {
    const missing = imageRungs('/images/insights/does-not-exist.webp');
    expect(missing.srcset).toBeUndefined();
    expect(missing.sizes).toBeUndefined();
    expect(imageRungs(undefined).sizes).toBeUndefined();
    expect(imageRungs('/images/logos/codilime.svg').srcset).toBeUndefined();
  });

  it('pairs sizes with srcset and never on its own', () => {
    const withSet = imageRungs(bodyImages()[0]);
    expect(withSet.sizes).toBe(PROSE_SIZES);
  });

  it('hashes every address, so a replaced picture is a new one', () => {
    for (const src of images) {
      const { src: hashed, srcset } = imageRungs(src);
      expect(hashed, src).toMatch(/\?v=[0-9a-f]{8}$/);
      for (const entry of srcset!.split(', ')) expect(entry, src).toMatch(/\?v=[0-9a-f]{8} \d+w$/);
    }
  });
});
