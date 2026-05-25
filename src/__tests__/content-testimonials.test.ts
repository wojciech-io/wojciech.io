import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';

const DIR = resolve('./src/content/testimonials');
const VOICE_FIT = ['high', 'medium', 'low'] as const;
const CLAIM_TIGHTNESS = ['specific-outcome', 'general-praise', 'character', 'generic'] as const;

function loadAll() {
  return readdirSync(DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({
      file: f,
      data: JSON.parse(readFileSync(resolve(DIR, f), 'utf-8')),
    }));
}

describe('testimonial content entries', () => {
  const entries = loadAll();

  it('finds at least one entry', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it.each(entries)('$file: required fields present', ({ data }) => {
    expect(typeof data.author).toBe('string');
    expect(data.author.length).toBeGreaterThan(0);
    expect(typeof data.role).toBe('string');
    expect(typeof data.company).toBe('string');
    expect(typeof data.quote).toBe('string');
    expect(data.quote.length).toBeGreaterThan(20);
    expect(typeof data.featured).toBe('boolean');
    expect(typeof data.order).toBe('number');
    expect(typeof data.draft).toBe('boolean');
  });

  it.each(entries)('$file: voiceFit is valid', ({ data }) => {
    expect(VOICE_FIT).toContain(data.voiceFit);
  });

  it.each(entries)('$file: claimTightness is valid', ({ data }) => {
    expect(CLAIM_TIGHTNESS).toContain(data.claimTightness);
  });

  it.each(entries)('$file: tags is array', ({ data }) => {
    expect(Array.isArray(data.tags)).toBe(true);
  });
});
