import { describe, it, expect, beforeAll } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, requireDist } from './helpers';

/**
 * Astro hands a widget whatever an article passes and renders what it can. A value of the wrong
 * shape does not fail the build: TwoUp printed "[object Object]" for the { title, items } form an
 * article passed, and EmbedDeck rendered an empty heading for every slide written with `title`.
 * Both shipped. The prop-name test cannot see either, because the names were fine and the values
 * were not, so this reads the built pages for the symptoms.
 */

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal
    // entry comes from readdirSync over the build output directory.
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry === 'index.html') out.push(full);
  }
  return out;
}

/** Page markup without scripts, where "[object Object]" could only be a rendering fault. */
function markup(file: string): string {
  return readFileSync(file, 'utf8').replace(/<script[\s\S]*?<\/script>/gi, '');
}

describe('built widgets', () => {
  let pages: string[] = [];
  beforeAll(() => {
    requireDist();
    pages = walk(DIST);
  });

  it('finds built pages to read', () => {
    expect(pages.length).toBeGreaterThan(50);
  });

  it('never prints an object or undefined as text', () => {
    const offenders: string[] = [];
    for (const file of pages) {
      const body = markup(file);
      if (/\[object Object\]/.test(body)) offenders.push(`${file.replace(DIST, '')}: [object Object]`);
      if (/>\s*undefined\s*</.test(body)) offenders.push(`${file.replace(DIST, '')}: undefined as text`);
    }
    expect(offenders).toEqual([]);
  });

  it('never renders an empty widget heading, label or title', () => {
    const empty = /<(p|span|h[2-6]|dt|dd|strong)\b[^>]*class="[^"]*\bw-[a-z0-9_-]*(?:heading|title|label|eyebrow|name|role|tech)\b[^"]*"[^>]*>\s*<\/\1>/g;
    const offenders: string[] = [];
    for (const file of pages) {
      for (const m of markup(file).matchAll(empty)) offenders.push(`${file.replace(DIST, '')}: ${m[0].slice(0, 80)}`);
    }
    expect(offenders).toEqual([]);
  });

  it('draws article widgets from the shared stylesheet, not the old scoped classes', () => {
    const old = /class="[^"]*\b(?:agent-flow|code-block|embed-deck|two-up|stack-layer-block|tech-stack|thread-block|img-slider|annotated-img|number-ticker|content-grid|protip|diagram-box|diagram-arrow|video-embed|article-quote)\b/;
    const offenders = pages.filter((file) => old.test(markup(file))).map((file) => file.replace(DIST, ''));
    expect(offenders).toEqual([]);
  });
});
