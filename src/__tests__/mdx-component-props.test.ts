import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Astro components ignore props they do not destructure, silently. `DoDont`
 * reads `do` and `dont`; two articles passed `doItems` and `dontItems`, and
 * the Do/Don't box rendered empty in English and in Polish for as long as
 * those articles have been published. Nothing failed, nothing warned, and the
 * page looked fine apart from a missing block nobody was looking for.
 *
 * This walks the other way: every prop an article passes has to be one the
 * component actually reads.
 */

const COMPONENTS_DIR = resolve('./packages/mdx-components/components');
const CONTENT_DIR = resolve('./src/content');

/** Prop names a component declares, read from its `interface Props`. */
function declaredProps(source: string): Set<string> | null {
  const block = source.match(/interface Props\s*\{([\s\S]*?)\n\}/);
  if (!block) return null;
  const names = new Set<string>();
  for (const line of block[1].split('\n')) {
    // `name?: type;` and `'name'?: type;` and `name: type;`
    const m = line.match(/^\s*['"]?([A-Za-z_$][\w$]*)['"]?\s*\??\s*:/);
    if (m) names.add(m[1]);
  }
  // Rest props: a component that spreads the remainder accepts anything.
  if (/\[key:\s*string\]/.test(block[1])) return null;
  return names.size > 0 ? names : null;
}

function loadComponents(): Map<string, Set<string>> {
  const out = new Map<string, Set<string>>();
  for (const file of readdirSync(COMPONENTS_DIR)) {
    if (!file.endsWith('.astro')) continue;
    // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal
    // file is a plain filename from readdirSync over a constant directory.
    const props = declaredProps(readFileSync(join(COMPONENTS_DIR, file), 'utf8'));
    if (props) out.set(file.replace(/\.astro$/, ''), props);
  }
  return out;
}

function walkMdx(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walkMdx(full));
    else if (entry.endsWith('.mdx')) out.push(full);
  }
  return out;
}

/**
 * Opening tags of capitalised components, with the prop names each one sets.
 *
 * Written as a scan rather than a regex on purpose. A prop value here can be
 * an array of objects holding Polish prose with apostrophes, quotes, braces
 * and angle brackets in it, and a regex that tries to match the closing ">"
 * reads the words inside those strings as further attributes. The first
 * version of this test reported "marki", "przekroczy" and "wyszukiwarce" as
 * undeclared props of DoDont.
 */
function componentProps(source: string): Array<{ name: string; props: string[]; line: number }> {
  // Blank out fenced code without moving any other character.
  const body = source.replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, ' '));
  const out: Array<{ name: string; props: string[]; line: number }> = [];

  for (const open of body.matchAll(/<([A-Z][\w.]*)/g)) {
    const name = open[1];
    const line = body.slice(0, open.index).split('\n').length;
    const props: string[] = [];

    let i = (open.index ?? 0) + open[0].length;
    let depth = 0;              // brace nesting inside a prop value
    let quote: string | null = null;
    let pending = '';           // identifier being read at depth 0

    for (; i < body.length; i += 1) {
      const ch = body[i];

      if (quote) {
        if (ch === quote && body[i - 1] !== '\\') quote = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === '`') {
        quote = ch;
        continue;
      }
      if (ch === '{') {
        depth += 1;
        continue;
      }
      if (ch === '}') {
        depth -= 1;
        continue;
      }
      if (depth > 0) continue;

      if (ch === '>') break;
      if (/[A-Za-z0-9_$:-]/.test(ch)) {
        pending += ch;
        continue;
      }
      if (ch === '=') {
        if (pending) props.push(pending);
        pending = '';
        continue;
      }
      pending = '';
    }

    out.push({ name, props, line });
  }
  return out;
}

describe('MDX component props', () => {
  const components = loadComponents();
  const files = walkMdx(CONTENT_DIR);

  it('reads prop declarations from the component package', () => {
    expect(components.size).toBeGreaterThan(5);
    expect(components.get('DoDont')).toContain('do');
  });

  it('finds article content to check', () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it('passes only props the component declares', () => {
    const unknown: string[] = [];

    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      const rel = file.replace(`${resolve('.')}/`, '');

      for (const use of componentProps(source)) {
        const declared = components.get(use.name);
        if (!declared) continue; // not one of ours, or it takes rest props

        for (const attr of use.props) {
          // Astro directives and slots are handled by the framework, not the
          // component's own Props interface.
          if (attr.includes(':') || attr === 'slot' || attr.startsWith('client')) continue;
          if (!declared.has(attr)) {
            unknown.push(`${rel}:${use.line} <${use.name} ${attr}=...> is not a declared prop`);
          }
        }
      }
    }

    expect(unknown).toEqual([]);
  });
});
