import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

/**
 * Pages are served with a trailing slash. An internal link written without one
 * still works, because Cloudflare answers it with a 308 to the slashed
 * address, which is exactly why nobody notices: the page loads, the link is
 * not broken, and every visit through it pays for a second round trip.
 *
 * Sixty-two of them had accumulated across the corpus, all in prose written by
 * hand rather than generated from `insightSlug`. A crawler following those
 * spends its budget on redirects, and the hop is a small tax on link equity
 * that compounds over a corpus this size.
 *
 * Only paths that are actually served with a slash are checked. Files, API
 * routes and anchors are left alone.
 */

const SRC = resolve('./src');
const EXTENSIONS = ['.mdx', '.md', '.astro'];

/** Section roots whose pages are served with a trailing slash. */
const SLASHED = /^\/(?:[a-z]{2}\/)?(?:insights|compare|work|apps|decks)\/[a-z0-9][a-z0-9-]*$/;

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal.path-join-resolve-traversal
    // name comes from readdirSync over a constant directory.
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...sourceFiles(full));
    else if (EXTENSIONS.some((e) => full.endsWith(e))) out.push(full);
  }
  return out;
}

const offenders: string[] = [];
for (const file of sourceFiles(SRC)) {
  const source = readFileSync(file, 'utf8');
  const found = [
    ...[...source.matchAll(/\]\((\/[^)\s"#?]*)\)/g)].map((m) => m[1]),
    ...[...source.matchAll(/href="(\/[^"\s#?]*)"/g)].map((m) => m[1]),
  ];
  for (const href of found) {
    // A path built from an expression is generated, not typed, and the helpers
    // already end in a slash.
    if (href.includes('${') || href.includes('{')) continue;
    if (SLASHED.test(href)) {
      offenders.push(`${relative(process.cwd(), file)}: ${href}`);
    }
  }
}

describe('internal links do not pay for a redirect', () => {
  it('finds links to check at all', () => {
    const anyLink = sourceFiles(SRC).some((f) => /href="\//.test(readFileSync(f, 'utf8')));
    expect(anyLink).toBe(true);
  });

  it('every link into a slashed section ends with the slash', () => {
    expect(
      [...new Set(offenders)],
      `these answer 308 before they answer 200:\n  ${[...new Set(offenders)].join('\n  ')}`
    ).toEqual([]);
  });
});
