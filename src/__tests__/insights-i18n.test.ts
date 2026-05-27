import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../content/insights/', import.meta.url);
const LOCALES = ['de', 'dk', 'no', 'jp'] as const;
const SOURCE_SLUGS = [
  'ai-production-stack',
  'claude-code-client-gtm',
  'claude-code-vs-clay',
  'crm-first-ai-adoption',
] as const;

const LOCALE_MARKERS: Record<(typeof LOCALES)[number], RegExp[]> = {
  de: [/\bDer\b|\bDie\b|\bDas\b/, /\bnicht\b/, /\bund\b/, /\bWenn\b/],
  dk: [/\bDet\b|\bDen\b|\bDer\b/, /\bog\b/, /\bikke\b/, /\bhvis\b/i],
  no: [/\bDet\b|\bDen\b/, /\bog\b/, /\bikke\b/, /\bhvis\b/i],
  jp: [/[\u3040-\u30ff]/, /[\u4e00-\u9faf]/],
};

function read(locale: (typeof LOCALES)[number], slug: string) {
  return readFileSync(join(ROOT.pathname, locale, `${slug}.mdx`), 'utf8');
}

function frontmatterValue(content: string, key: string) {
  const prefix = `${key}:`;
  const line = content.split('\n').find((entry) => entry.startsWith(prefix));
  return line?.slice(prefix.length).trim().replace(/^"|"$/g, '');
}

describe('localized insight articles', () => {
  it.each(LOCALES)('%s has all translated articles', (locale) => {
    const dir = join(ROOT.pathname, locale);
    expect(existsSync(dir), `${locale} directory missing`).toBe(true);
    const files = readdirSync(dir).filter((file) => file.endsWith('.mdx')).sort();
    expect(files).toEqual(SOURCE_SLUGS.map((slug) => `${slug}.mdx`).sort());
  });

  it.each(LOCALES)('%s articles are localized content, not short EN stubs', (locale) => {
    const joined = SOURCE_SLUGS.map((slug) => read(locale, slug)).join('\n\n');
    expect(joined.length, `${locale} localized article copy too short`).toBeGreaterThan(16000);
    for (const marker of LOCALE_MARKERS[locale]) {
      expect(joined, `${locale} missing marker ${marker}`).toMatch(marker);
    }
  });

  it.each(LOCALES)('%s articles carry locale metadata and source slug', (locale) => {
    for (const slug of SOURCE_SLUGS) {
      const content = read(locale, slug);
      expect(frontmatterValue(content, 'locale'), `${locale}/${slug} locale`).toBe(locale);
      expect(frontmatterValue(content, 'translationOf'), `${locale}/${slug} translationOf`).toBe(slug);
    }
  });

  it.each(LOCALES)('%s article links stay in the active locale', (locale) => {
    for (const slug of SOURCE_SLUGS) {
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
      expect(read(locale, 'ai-production-stack')).toContain('<KeyTakeaway');
      expect(read(locale, 'claude-code-vs-clay')).toContain('<Comparison');
    }
  });
});
