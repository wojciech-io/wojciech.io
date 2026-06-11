import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../content/insights/', import.meta.url);
const LOCALES = ['pl'] as const;

/** Articles that MUST exist in every locale (baseline coverage). */
const REQUIRED_SLUGS = [
  'ai-production-stack',
  'claude-code-client-gtm',
  'claude-code-vs-clay',
  'crm-first-ai-adoption',
] as const;

const LOCALE_MARKERS: Record<(typeof LOCALES)[number], RegExp[]> = {
  pl: [/\b(że|jest|nie|który|która)\b/i, /\b(się|tylko|dla)\b/i],
};

function slugsInLocale(locale: (typeof LOCALES)[number]) {
  const dir = join(ROOT.pathname, locale);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
    .sort();
}

function read(locale: (typeof LOCALES)[number], slug: string) {
  return readFileSync(join(ROOT.pathname, locale, `${slug}.mdx`), 'utf8');
}

function frontmatterValue(content: string, key: string) {
  const prefix = `${key}:`;
  const line = content.split('\n').find((entry) => entry.startsWith(prefix));
  return line?.slice(prefix.length).trim().replace(/^"|"$/g, '');
}

describe('localized insight articles', () => {
  it.each(LOCALES)('%s has at least the required translated articles', (locale) => {
    const dir = join(ROOT.pathname, locale);
    expect(existsSync(dir), `${locale} directory missing`).toBe(true);
    const slugs = slugsInLocale(locale);
    for (const required of REQUIRED_SLUGS) {
      expect(slugs, `${locale} missing required article: ${required}`).toContain(required);
    }
  });

  it.each(LOCALES)('%s articles are localized content, not short EN stubs', (locale) => {
    const joined = REQUIRED_SLUGS.map((slug) => read(locale, slug)).join('\n\n');
    expect(joined.length, `${locale} localized article copy too short`).toBeGreaterThan(16000);
    for (const marker of LOCALE_MARKERS[locale]) {
      expect(joined, `${locale} missing marker ${marker}`).toMatch(marker);
    }
  });

  it.each(LOCALES)('%s articles carry locale metadata and source slug', (locale) => {
    const slugs = slugsInLocale(locale);
    for (const slug of slugs) {
      const content = read(locale, slug);
      expect(frontmatterValue(content, 'locale'), `${locale}/${slug} locale`).toBe(locale);
      expect(frontmatterValue(content, 'translationOf'), `${locale}/${slug} translationOf`).toBe(slug);
    }
  });

  it.each(LOCALES)('%s article links stay in the active locale', (locale) => {
    const slugs = slugsInLocale(locale);
    for (const slug of slugs) {
      const content = read(locale, slug);
      expect(content, `${locale}/${slug} has bare EN insight link`).not.toMatch(/\]\(\/insights\//);
      expect(content, `${locale}/${slug} has bare EN contact anchor`).not.toContain('/contact#book-call');
    }
  });

  it('MDX comparison and takeaway components are exercised by published articles', () => {
    const englishTakeaway = readFileSync(join(ROOT.pathname, 'ai-production-stack.mdx'), 'utf8');
    const englishComparison = readFileSync(join(ROOT.pathname, 'claude-code-vs-clay.mdx'), 'utf8');
    expect(englishTakeaway).toContain('<KeyTakeaway');
    expect(englishComparison).toContain('<Comparison');

    for (const locale of LOCALES) {
      const takeaway = read(locale, 'ai-production-stack');
      const comparison = read(locale, 'claude-code-vs-clay');
      expect(takeaway).toContain('<KeyTakeaway');
      expect(comparison).toContain('<Comparison');
    }
  });
});
