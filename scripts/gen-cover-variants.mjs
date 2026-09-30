/**
 * Cover art ships at 1200px (and 2400px for retina). A card in a three column
 * grid is about 352px wide, so every listing page was downloading a full-width
 * hero to paint a thumbnail. This adds the missing low rung: an 800px twin,
 * which covers a card on a phone and on a retina desktop alike. The portfolio
 * screenshots on /marketing sit in the same three column grid.
 *
 * Idempotent: a variant that already matches the source is left alone.
 *
 *   node scripts/gen-cover-variants.mjs [--force]
 */
import { readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const DIRS = ['public/images/insights', 'public/images/portfolio'];

/* 800px is the card rung. A second rung at 1500px exists only for sources wide
 * enough to need one: the in-article screenshots are 2360px, and the prose
 * column caps at 736px, so a retina reader needs about 1472px and nothing
 * near 2360. Ordinary covers are 1200 to 1536px and get no mid rung, because
 * there is nothing useful between 800 and their own width. */
const RUNGS = [
  { width: 800, minSource: 800 },
  { width: 1500, minSource: 1800 },
];
const force = process.argv.includes('--force');

/** A source cover, as opposed to a generated twin. */
const isSource = (f) => f.endsWith('.webp') && !/-\d{3,4}\.webp$/.test(f);

let made = 0;
let skipped = 0;
let saved = 0;

for (const dir of DIRS) {
  const root = resolve(process.cwd(), dir);
  for (const file of readdirSync(root).filter(isSource).sort()) {
    const src = resolve(root, file);

    const { width } = await sharp(src).metadata();
    if (!width) {
      skipped += 1;
      continue;
    }

    for (const rung of RUNGS) {
      if (width <= rung.width || width < rung.minSource) {
        skipped += 1;
        continue;
      }
      const out = resolve(root, file.replace(/\.webp$/, `-${rung.width}.webp`));

      let exists = false;
      try {
        exists = statSync(out).isFile();
      } catch {
        /* not there yet */
      }
      if (exists && !force) {
        skipped += 1;
        continue;
      }

      await sharp(src).resize({ width: rung.width, withoutEnlargement: true }).webp({ quality: 80, effort: 6 }).toFile(out);
      made += 1;
      saved += statSync(src).size - statSync(out).size;
    }
  }
}

console.log(`${made} written, ${skipped} left alone, ${(saved / 1024).toFixed(0)} KB of headroom created`);
