import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import yaml from 'js-yaml';

const INSIGHTS_DIR = resolve('./src/content/insights');
const VALID_CATEGORIES = ['AI Systems', 'GTM Architecture', 'Operator Playbooks', 'Products'] as const;
const VALID_COVER_TYPES = ['terminal', 'builder', 'chart', 'product', 'system', 'default'] as const;

function parseFrontmatter(raw: string): Record<string, unknown> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error('No frontmatter block found');
  return (yaml.load(match[1]) ?? {}) as Record<string, unknown>;
}

function loadAll() {
  return readdirSync(INSIGHTS_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => {
      const raw = readFileSync(resolve(INSIGHTS_DIR, f), 'utf-8');
      return { file: f, data: parseFrontmatter(raw) };
    });
}

describe('insights content entries', () => {
  const entries = loadAll();

  it('finds at least one published article', () => {
    const published = entries.filter((e) => e.data.draft !== true);
    expect(published.length, 'no published insights found').toBeGreaterThan(0);
  });

  it.each(entries)('$file: has required string fields', ({ file, data }) => {
    expect(typeof data.title, `${file}: title must be a string`).toBe('string');
    expect((data.title as string).length, `${file}: title empty`).toBeGreaterThan(5);
    expect(typeof data.description, `${file}: description must be a string`).toBe('string');
    expect((data.description as string).length, `${file}: description empty`).toBeGreaterThan(20);
  });

  it.each(entries)('$file: publishedAt is a valid date string', ({ file, data }) => {
    expect(data.publishedAt, `${file}: publishedAt missing`).toBeTruthy();
    const d = new Date(data.publishedAt as string);
    expect(isNaN(d.getTime()), `${file}: publishedAt is not a valid date`).toBe(false);
    expect(d.getFullYear(), `${file}: publishedAt year looks wrong`).toBeGreaterThanOrEqual(2024);
  });

  it.each(entries)('$file: updatedAt is a valid date if present', ({ file, data }) => {
    if (!data.updatedAt) return;
    const d = new Date(data.updatedAt as string);
    expect(isNaN(d.getTime()), `${file}: updatedAt is not a valid date`).toBe(false);
  });

  it.each(entries)('$file: tags is an array', ({ file, data }) => {
    if (data.tags !== undefined) {
      expect(Array.isArray(data.tags), `${file}: tags must be an array`).toBe(true);
    }
  });

  it.each(entries)('$file: category is valid if present', ({ file, data }) => {
    if (!data.category) return;
    expect(VALID_CATEGORIES, `${file}: unknown category "${data.category}"`).toContain(
      data.category,
    );
  });

  it.each(entries)('$file: coverType is valid if present', ({ file, data }) => {
    if (!data.coverType) return;
    expect(VALID_COVER_TYPES, `${file}: unknown coverType "${data.coverType}"`).toContain(
      data.coverType,
    );
  });

  it.each(entries)('$file: no em dash in title or description', ({ file, data }) => {
    const title = (data.title as string) ?? '';
    const desc = (data.description as string) ?? '';
    expect(title, `${file}: em dash found in title`).not.toContain('—');
    expect(desc, `${file}: em dash found in description`).not.toContain('—');
  });

  it.each(entries)('$file: draft is a boolean if present', ({ file, data }) => {
    if (data.draft !== undefined) {
      expect(typeof data.draft, `${file}: draft must be boolean`).toBe('boolean');
    }
  });

  it.each(entries)('$file: featured is a boolean if present', ({ file, data }) => {
    if (data.featured !== undefined) {
      expect(typeof data.featured, `${file}: featured must be boolean`).toBe('boolean');
    }
  });

  it('no duplicate article filenames (slug collision guard)', () => {
    const files = entries.map((e) => e.file.replace(/\.(md|mdx)$/, ''));
    const unique = new Set(files);
    expect(unique.size, 'duplicate article slug detected').toBe(files.length);
  });
});
