import { describe, it, expect, beforeAll } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { DIST, requireDist } from './helpers';

/**
 * Every internal link on every built page has to resolve.
 *
 * The Playwright audit in tests/e2e/links.spec.ts checks twelve hand-listed
 * pages and caps each at twenty links. That is a smoke test, and it missed a
 * real set: twelve dead "read the insights" CTAs across six localized
 * ai-systems pages, a 404 on the closing CTA of the Kade article, and three
 * article links to /bites/, which holds zip files and no index page. None of
 * those pages were on the list.
 *
 * This walks the whole build instead, so a route that disappears takes every
 * link to it down with the suite. It reads dist/ rather than driving a
 * browser, so it costs a second.
 */

const IGNORED_PREFIXES = ['/_astro/', '/search/'];

/**
 * Extensions that are files on disk, not routed pages. The upper bound is 12
 * rather than a tidier 5 because `.webmanifest` is eleven characters, and a
 * bound that excluded it appended a trailing slash to every reference and
 * reported the manifest as broken on all 150 pages.
 */
const FILE_EXT = /\.[a-z0-9]{2,12}$/i;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function routeOf(file: string): string {
  const rel = relative(DIST, file).split(sep).join('/');
  return '/' + rel.replace(/index\.html$/, '');
}

/** Strip fragment and query, and normalise to a trailing slash for pages. */
function normalise(href: string): string | null {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean.startsWith('/')) return null;
  if (FILE_EXT.test(clean)) return clean;
  return clean.endsWith('/') ? clean : `${clean}/`;
}

let pages: string[] = [];
let routes: Set<string>;

beforeAll(() => {
  requireDist();
  pages = walk(DIST);
  routes = new Set(pages.map(routeOf));
});

describe('internal links resolve', () => {
  it('finds a plausible number of built pages', () => {
    expect(pages.length).toBeGreaterThan(100);
  });

  it('no internal link points at a route or file that was not built', () => {
    const broken: string[] = [];

    for (const page of pages) {
      const from = routeOf(page);
      const doc = readFileSync(page, 'utf8');

      for (const [, raw] of doc.matchAll(/href="(\/[^"]*)"/g)) {
        const target = normalise(raw);
        if (!target) continue;
        if (IGNORED_PREFIXES.some((p) => target.startsWith(p))) continue;

        // A file reference resolves against the build output; a page
        // reference has to be a route the build actually emitted.
        const ok = FILE_EXT.test(target)
          ? existsSync(join(DIST, target.replace(/^\//, '')))
          : routes.has(target);

        if (!ok) broken.push(`${target}  <- ${from}`);
      }
    }

    const unique = [...new Set(broken)].sort();
    expect(unique, `broken internal links:\n  ${unique.join('\n  ')}`).toEqual([]);
  });
});
