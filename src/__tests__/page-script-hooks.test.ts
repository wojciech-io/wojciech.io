import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

/**
 * An inline page script may only look up element IDs its own page renders.
 *
 * The insights index shipped a layout change that removed the category
 * filter's markup and kept its script. The script read the count and the
 * empty state with `document.getElementById('…')!`, so a missing optional
 * element became `Cannot read properties of null` on every page load, and it
 * threw before the click listeners were attached: the filter stopped working
 * even on the pages whose markup was intact.
 *
 * Nothing caught it. The build was clean, every unit test passed, and the
 * error only existed in a browser console. Hence this file.
 *
 * The rule is deliberately narrow: an ID the script looks up must appear as an
 * `id="…"` somewhere in the same source file. A conditionally rendered element
 * still satisfies it, because the attribute is in the source either way, and a
 * script that guards its lookups is correct at runtime regardless. What the
 * rule rules out is the case that actually shipped: a lookup for markup that
 * no longer exists anywhere on the page.
 */

const PAGES = resolve('./src/pages');
const COMPONENTS = resolve('./src/components');

/** IDs that belong to another document by design. */
const EXTERNAL = new Set<string>([]);

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

/**
 * Strip comments before scanning. The first version of this file failed on
 * itself: the prose explaining the bug quoted `getElementById('…')!`, and the
 * rule matched the explanation. A test that cannot survive being written
 * about is not a rule, it is a string search.
 */
function code(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:'"\`])\/\/[^\n]*/g, '$1 ')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ');
}

const files = [...astroFiles(PAGES), ...astroFiles(COMPONENTS)].map((path) => ({
  file: relative(process.cwd(), path),
  source: readFileSync(path, 'utf8'),
  scan: code(readFileSync(path, 'utf8')),
}));

const lookups = files.flatMap(({ file, source, scan }) => {
  const ids = [...scan.matchAll(/getElementById\(\s*'([^']+)'\s*\)/g)].map((m) => m[1]);
  return [...new Set(ids)]
    .filter((id) => !EXTERNAL.has(id))
    .map((id) => ({ file, id, source }));
});

describe('inline page scripts only reach for markup their page renders', () => {
  it('finds lookups to check at all', () => {
    // A rewrite that moved every script out would make the suite below pass by
    // testing nothing, which is worse than failing.
    expect(lookups.length).toBeGreaterThan(0);
  });

  it.each(lookups)('$file renders #$id', ({ file, id, source }) => {
    const rendered =
      source.includes(`id="${id}"`) ||
      source.includes(`id='${id}'`) ||
      source.includes(`id={\`${id}\``);
    expect(rendered, `${file}: its script looks up #${id}, which the page never renders`).toBe(
      true,
    );
  });
});

/**
 * The second half of the same lesson: a non-null assertion on a DOM lookup
 * turns absent optional markup into a thrown error for every visitor, and it
 * does so at module scope, before any listener is attached.
 */
describe('page scripts do not assert that optional markup exists', () => {
  const offenders = files.flatMap(({ file, scan }) =>
    [...scan.matchAll(/(getElementById|querySelector(?:All)?)\([^)]*\)\s*!/g)].map(
      (m) => `${file}: ${m[0].slice(0, 80)}`,
    ),
  );

  it('no getElementById(...)! or querySelector(...)! in a page script', () => {
    expect(
      offenders,
      `these turn missing optional markup into a page-wide crash:\n  ${offenders.join('\n  ')}`,
    ).toEqual([]);
  });
});
