import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * A translation is a copy that stops being true on its own schedule.
 *
 * Three English articles were corrected between 23 and 29 September, twice
 * because a claim in them had become false: Claude Opus 5.5 took the top of
 * the index and the articles still said the old leaders tied for first. The
 * Polish copies were corrected with them. The German, Spanish and Italian
 * copies were not, and nothing failed, so for a week the same false claim sat
 * on the site in three languages while the English page next to it said the
 * opposite.
 *
 * Nothing about that is visible from the English file, which is the whole
 * problem: the author of the fix never sees the copies. A date comparison is
 * crude, but it is the one signal that exists in both files, and it is enough
 * to make the omission loud.
 *
 * When the fix genuinely does not apply to a locale, bump that file's
 * `updatedAt` with a line saying why. The point is a decision, not a date.
 */

const ROOT = resolve('./src/content/insights');

function field(frontmatter: string, key: string): string {
  return frontmatter.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, 'm'))?.[1] ?? '';
}

interface Article {
  slug: string;
  locale: string;
  updated: string;
}

function read(path: string): { fm: string } | null {
  const source = readFileSync(path, 'utf8');
  const parts = source.split('---');
  return parts.length > 2 ? { fm: parts[1] } : null;
}

const originals = new Map<string, Article>();
const translations: Article[] = [];

for (const entry of readdirSync(ROOT, { withFileTypes: true })) {
  const isLocaleDir = entry.isDirectory();
  const names = isLocaleDir
    ? readdirSync(join(ROOT, entry.name)).map((n) => ({ locale: entry.name, name: n }))
    : [{ locale: 'en', name: entry.name }];

  for (const { locale, name } of names) {
    if (!name.endsWith('.mdx') && !name.endsWith('.md')) continue;
    // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal.path-join-resolve-traversal
    // Names come from readdirSync over a constant directory.
    const path = locale === 'en' ? join(ROOT, name) : join(ROOT, locale, name);
    const parsed = read(path);
    if (!parsed) continue;
    if (field(parsed.fm, 'draft') === 'true') continue;

    const slug = name.replace(/\.mdx?$/, '');
    const article: Article = {
      slug,
      locale,
      updated: field(parsed.fm, 'updatedAt') || field(parsed.fm, 'publishedAt'),
    };
    if (locale === 'en') originals.set(slug, article);
    else translations.push(article);
  }
}

describe('translations do not fall behind their original', () => {
  it('finds translations to check', () => {
    expect(translations.length).toBeGreaterThan(10);
  });

  it('every translation is at least as fresh as its English original', () => {
    const stale = translations
      .map((t) => ({ t, en: originals.get(t.slug) }))
      .filter(({ t, en }) => en && t.updated && en.updated && t.updated < en.updated)
      .map(
        ({ t, en }) =>
          `${t.locale}/${t.slug}: ${t.updated} against the English ${en!.updated}`
      );

    expect(
      stale,
      `the English original moved and these did not. Carry the change over, or bump updatedAt with a note saying it does not apply:\n  ${stale.join('\n  ')}`
    ).toEqual([]);
  });

  it('no translation exists without an English original', () => {
    const orphans = translations
      .filter((t) => !originals.has(t.slug))
      .map((t) => `${t.locale}/${t.slug}`);
    expect(orphans, `these have nothing to stay in sync with:\n  ${orphans.join('\n  ')}`).toEqual(
      []
    );
  });
});
