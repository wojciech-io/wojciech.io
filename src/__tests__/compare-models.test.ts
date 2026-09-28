import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { vendorOf } from '../lib/compare';

/**
 * `/compare/` groups comparisons by the `models` frontmatter. A typo there
 * does not fail the build and does not look wrong in the article: it quietly
 * creates a group of one, under a vendor of "Other", that no reader will ever
 * find. "Claude Opus 5.5" and "Claude Opus 5.5 " are two different models as
 * far as a Map key is concerned.
 *
 * So every value has to be one the vendor table knows, and the same article in
 * another language has to name the same models, or the Polish hub silently
 * groups differently from the English one.
 */

const ROOT = resolve('./src/content/insights');

function frontmatter(source: string): string {
  const parts = source.split('---');
  return parts.length > 2 ? parts[1] : '';
}

function models(fm: string): string[] {
  const block = fm.match(/^models:\n((?:\s+- .*\n)+)/m);
  if (!block) return [];
  return [...block[1].matchAll(/^\s+- "(.*)"$/gm)].map((m) => m[1]);
}

function isDraft(fm: string): boolean {
  return /^draft: true/m.test(fm);
}

interface Article {
  file: string;
  locale: string;
  slug: string;
  models: string[];
}

function collect(): Article[] {
  const out: Article[] = [];
  for (const entry of readdirSync(ROOT, { withFileTypes: true })) {
    const files = entry.isDirectory()
      ? readdirSync(join(ROOT, entry.name)).map((n) => ({ locale: entry.name, name: n }))
      : [{ locale: 'en', name: entry.name }];
    for (const { locale, name } of files) {
      if (!name.endsWith('.mdx') && !name.endsWith('.md')) continue;
      const path = locale === 'en' ? join(ROOT, name) : join(ROOT, locale, name);
      const fm = frontmatter(readFileSync(path, 'utf8'));
      if (isDraft(fm)) continue;
      const list = models(fm);
      if (!list.length) continue;
      out.push({
        file: locale === 'en' ? name : `${locale}/${name}`,
        locale,
        slug: name.replace(/\.mdx?$/, ''),
        models: list,
      });
    }
  }
  return out;
}

const articles = collect();

describe('comparison articles declare models the hub can group', () => {
  it('finds comparison articles at all', () => {
    expect(articles.length).toBeGreaterThan(20);
  });

  it.each(articles)('$file names only known models', ({ file, models: list }) => {
    const unknown = list.filter((m) => vendorOf(m) === 'Other');
    expect(
      unknown,
      `${file}: ${unknown.join(', ')} is not in the vendor table in src/lib/compare.ts, so it would render under an empty vendor in a group of its own`
    ).toEqual([]);
  });

  it.each(articles)('$file names at least two models', ({ file, models: list }) => {
    expect(list.length, `${file}: a comparison needs both sides`).toBeGreaterThanOrEqual(2);
  });

  it.each(articles)('$file has no duplicate entries', ({ file, models: list }) => {
    expect(new Set(list).size, `${file}: the same model listed twice`).toBe(list.length);
  });

  it('a translated article names the same models as its English original', () => {
    const en = new Map(articles.filter((a) => a.locale === 'en').map((a) => [a.slug, a.models]));
    const drift: string[] = [];
    for (const article of articles) {
      if (article.locale === 'en') continue;
      const original = en.get(article.slug);
      if (!original) continue;
      if (original.join('|') !== article.models.join('|')) {
        drift.push(`${article.file}: [${article.models}] against English [${original}]`);
      }
    }
    expect(drift, `these would group differently on the localized hub:\n  ${drift.join('\n  ')}`).toEqual(
      []
    );
  });
});
