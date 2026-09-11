import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

/**
 * Search snippets are truncated, not penalised, so this is about who writes
 * the sentence a reader sees: you, or Google's ellipsis.
 *
 * Google renders roughly 155 to 160 characters of a meta description on
 * desktop and fewer on mobile, measured in pixels rather than characters, so
 * no single number is exact. What is not a judgement call is a description of
 * 314 characters: half of it could never appear anywhere. Twenty-seven
 * articles were in that state, every one of the traffic-earning ones among
 * them.
 *
 * Hence two lines rather than one. HARD is where a real chunk of the sentence
 * is thrown away and the copy is simply wrong; it fails. REVIEW is the point
 * where the tail starts getting clipped; it prints and does not fail, because
 * trimming a 170-character description to 160 is a stylistic call and a test
 * that fails on nineteen of those would just get muted.
 */

const INSIGHTS_DIR = resolve('./src/content/insights');
const HARD = 200;
const REVIEW = 160;

// Titles are shown at around 60 characters. This one is advisory only: the
// tone spec asks for specific titles over short ones, and truncation there
// costs less than a vague headline does.
const TITLE_REVIEW = 60;

interface Entry {
  file: string;
  title: string;
  seoTitle: string | null;
  description: string;
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal
    // name comes from readdirSync over a constant directory.
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (full.endsWith('.mdx')) out.push(full);
  }
  return out;
}

/**
 * Read the three fields straight out of the frontmatter block rather than
 * through a YAML parser. Only quoted scalars are of interest here, and a
 * parser would also have to be taught the collection schema.
 */
function load(): Entry[] {
  return walk(INSIGHTS_DIR).map((path) => {
    const raw = readFileSync(path, 'utf8');
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const block = fm?.[1] ?? '';
    // Three literal patterns rather than one built from a field name. The
    // dynamic version read better and tripped semgrep's non-literal-regexp
    // rule, and there are only ever three fields to read.
    return {
      file: relative(INSIGHTS_DIR, path),
      title: block.match(/^title: "(.*)"$/m)?.[1] ?? '',
      seoTitle: block.match(/^seoTitle: "(.*)"$/m)?.[1] ?? null,
      description: block.match(/^description: "(.*)"$/m)?.[1] ?? '',
    };
  });
}

describe('search snippet lengths', () => {
  const entries = load();

  it('finds every article, in every locale', () => {
    expect(entries.length).toBeGreaterThan(50);
    expect(new Set(entries.map((e) => e.file.split('/')[0])).size).toBeGreaterThan(2);
  });

  it('every article has a description', () => {
    const missing = entries.filter((e) => e.description.length < 20).map((e) => e.file);
    expect(missing).toEqual([]);
  });

  it('no description is long enough to lose a real part of the sentence', () => {
    const tooLong = entries
      .filter((e) => e.description.length > HARD)
      .map((e) => `${e.file} (${e.description.length} chars, ${e.description.length - REVIEW} past the fold)`);
    expect(tooLong).toEqual([]);
  });

  it('reports descriptions past the review line without failing', () => {
    const past = entries
      .filter((e) => e.description.length > REVIEW && e.description.length <= HARD)
      .sort((a, b) => b.description.length - a.description.length);

    if (past.length > 0) {
      // Advisory. Printed so it shows up in the CI log next to the hard check,
      // which is the only reason this assertion exists.
      console.log(`\n  ${past.length} description(s) past ${REVIEW} chars, worth a trim:`);
      for (const e of past) console.log(`    ${e.description.length}  ${e.file}`);
    }
    expect(past.length).toBeLessThanOrEqual(entries.length);
  });

  it('reports titles past the review line without failing', () => {
    const past = entries
      .map((e) => ({ file: e.file, len: (e.seoTitle ?? e.title).length, used: e.seoTitle ? 'seoTitle' : 'title' }))
      .filter((e) => e.len > TITLE_REVIEW)
      .sort((a, b) => b.len - a.len);

    if (past.length > 0) {
      console.log(`\n  ${past.length} title(s) past ${TITLE_REVIEW} chars:`);
      for (const e of past.slice(0, 10)) console.log(`    ${e.len}  ${e.file} (${e.used})`);
    }
    expect(past.length).toBeLessThanOrEqual(entries.length);
  });

  it('keeps em dashes out of the snippet fields', () => {
    // The tone spec bans them in visible text, and a snippet is as visible as
    // text gets. content-insights covers the English files; this covers every
    // locale.
    const offenders = entries
      .filter((e) => `${e.title}${e.seoTitle ?? ''}${e.description}`.includes('—'))
      .map((e) => e.file);
    expect(offenders).toEqual([]);
  });
});
