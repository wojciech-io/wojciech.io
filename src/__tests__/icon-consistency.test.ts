import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

/**
 * `Icon.astro` calls itself the single source of truth for the line-icon set,
 * and for a while it was not: 46 icons sat in `src/icons` while 59 more were
 * drawn by hand in the markup. The same arrow pointing right existed on a
 * 12, a 13 and two different 14 grids, which is why the icons looked like
 * they came from different sets. They did.
 *
 * This test does not ban inline SVG. Brand marks are filled paths that belong
 * nowhere near a stroke set, illustrations are not icons, and a one-off shape
 * is fine. What it bans is drawing a path the set already owns, because that
 * is the case that drifts: nobody notices a stroke width until two of them
 * sit side by side.
 */

const SRC = resolve('./src');
const ICONS = resolve('./src/icons');

function astroFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal.path-join-resolve-traversal
    // name comes from readdirSync over a constant directory.
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...astroFiles(full));
    else if (full.endsWith('.astro')) out.push(full);
  }
  return out;
}

/** Path data of every icon in the set, normalised for comparison. */
const setPaths = new Map<string, string>();
for (const name of readdirSync(ICONS)) {
  if (!name.endsWith('.svg')) continue;
  const source = readFileSync(join(ICONS, name), 'utf8');
  for (const m of source.matchAll(/\sd="([^"]+)"/g)) {
    setPaths.set(normalise(m[1]), name.replace('.svg', ''));
  }
}

/**
 * Two hand-drawn copies of one icon rarely share coordinates, because each was
 * redrawn for its own grid. Scaling every number onto the set's 24 grid makes
 * them comparable: "M2 6h8M6 2l4 4-4 4" on a 12 grid and "M3 7h8M7 3l4 4-4 4"
 * on a 14 grid both land on the same arrow.
 *
 * The first version of this dropped the numbers entirely and compared only the
 * command letters. That collapsed every three-segment path into one signature
 * and accused a chevron of being a terminal prompt. Coordinates are the whole
 * difference between two icons, so they have to survive normalisation.
 */
function normalise(d: string, grid = 24): string {
  const scale = 24 / grid;
  return d
    .replace(/-?[\d.]+/g, (n) => (Number(n) * scale).toFixed(1))
    .replace(/[\s,]+/g, ' ')
    .trim()
    .toLowerCase();
}

const INLINE_ICON = /<svg\b[^>]*viewBox="0 0 (\d+) \1"[^>]*>([\s\S]*?)<\/svg>/g;

const offenders: string[] = [];
for (const file of astroFiles(SRC)) {
  // The component itself renders the set, and the set lives in src/icons.
  if (file.endsWith('Icon.astro')) continue;
  const source = readFileSync(file, 'utf8');
  for (const match of source.matchAll(INLINE_ICON)) {
    const grid = Number(match[1]);
    const inner = match[2];
    // Illustrations and brand marks are out of scope: the first is not an icon,
    // the second is a filled logo that no stroke set should own.
    if (grid > 40) continue;
    if (!/stroke-width/.test(inner)) continue;
    const paths = [...inner.matchAll(/\sd="([^"]+)"/g)].map((m) => normalise(m[1], grid));
    for (const d of paths) {
      const owned = setPaths.get(d);
      if (owned) {
        offenders.push(
          `${relative(process.cwd(), file)}: draws "${owned}" by hand on a ${grid}px grid`
        );
      }
    }
  }
}

describe('icons come from the set rather than being redrawn', () => {
  it('has a set to compare against', () => {
    expect(setPaths.size).toBeGreaterThan(20);
  });

  it('no markup redraws an icon src/icons already owns', () => {
    expect(
      [...new Set(offenders)],
      `use <Icon name="..." /> instead:\n  ${[...new Set(offenders)].join('\n  ')}`
    ).toEqual([]);
  });
});

describe('the icon set itself is one grid and one weight', () => {
  const files = readdirSync(ICONS).filter((n) => n.endsWith('.svg'));

  it.each(files)('%s is 24x24', (name) => {
    const source = readFileSync(join(ICONS, name), 'utf8');
    expect(source, `${name}: every icon shares the 24 grid`).toMatch(/viewBox="0 0 24 24"/);
  });

  it.each(files)('%s strokes at 1.5 and inherits colour', (name) => {
    const source = readFileSync(join(ICONS, name), 'utf8');
    const widths = [...source.matchAll(/stroke-width="([\d.]+)"/g)].map((m) => m[1]);
    for (const w of widths) {
      expect(w, `${name}: stroke ${w} against the set's 1.5`).toBe('1.5');
    }
    if (/\sstroke="/.test(source)) {
      expect(source, `${name}: colour comes from currentColor, not a fixed value`).toMatch(
        /stroke="currentColor"/
      );
    }
  });
});
