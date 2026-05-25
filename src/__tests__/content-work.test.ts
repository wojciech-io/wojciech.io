import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';

const WORK_DIR = resolve('./src/content/work');
const CLUSTERS = ['ai-gtm', 'growth-architecture', 'products-shipped'] as const;

function loadAll() {
  return readdirSync(WORK_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({
      file: f,
      data: JSON.parse(readFileSync(resolve(WORK_DIR, f), 'utf-8')),
    }));
}

describe('work content entries', () => {
  const entries = loadAll();

  it('finds at least one entry', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it.each(entries)('$file — required fields present', ({ data }) => {
    expect(typeof data.title).toBe('string');
    expect(data.title.length).toBeGreaterThan(0);
    expect(typeof data.description).toBe('string');
    expect(CLUSTERS).toContain(data.cluster);
    expect(Array.isArray(data.tags)).toBe(true);
    expect(data.tags.length).toBeGreaterThan(0);
    expect(typeof data.featured).toBe('boolean');
    expect(typeof data.order).toBe('number');
  });

  it.each(entries)('$file — metrics are valid if present', ({ data }) => {
    if (!data.metrics) return;
    expect(Array.isArray(data.metrics)).toBe(true);
    for (const m of data.metrics) {
      expect(typeof m.label).toBe('string');
      expect(typeof m.value).toBe('string');
    }
  });

  it.each(entries)('$file — image path starts with slash if present', ({ data }) => {
    if (!data.image) return;
    expect(data.image).toMatch(/^\//);
  });
});
