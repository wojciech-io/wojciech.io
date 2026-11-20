import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LEAD_MAGNETS } from '../data/leadMagnets';

const PUBLIC_DIR = join(process.cwd(), 'public');

describe('lead magnets', () => {
  it('has unique slugs', () => {
    const slugs = LEAD_MAGNETS.map((m) => m.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('keeps every download on disk', () => {
    for (const magnet of LEAD_MAGNETS) {
      expect(magnet.files.length, magnet.slug).toBeGreaterThan(0);
      for (const file of magnet.files) {
        expect(existsSync(join(PUBLIC_DIR, file.href)), file.href).toBe(true);
      }
    }
  });

  it('lists four to six points on what the reader gets', () => {
    for (const magnet of LEAD_MAGNETS) {
      expect(magnet.gets.length, magnet.slug).toBeGreaterThanOrEqual(4);
      expect(magnet.gets.length, magnet.slug).toBeLessThanOrEqual(6);
    }
  });

  it('keeps visible copy free of em dashes and the unpublished company name', () => {
    for (const magnet of LEAD_MAGNETS) {
      const text = JSON.stringify(magnet);
      expect(text, magnet.slug).not.toContain('—');
      expect(text.toLowerCase(), magnet.slug).not.toContain('definic');
    }
  });

  it('keeps meta description within search snippet length', () => {
    for (const magnet of LEAD_MAGNETS) {
      expect(magnet.meta.description.length, magnet.slug).toBeLessThanOrEqual(160);
    }
  });

  it('makes no outcome claims with percentages', () => {
    for (const magnet of LEAD_MAGNETS) {
      expect(JSON.stringify(magnet), magnet.slug).not.toMatch(/\d\s?%/);
    }
  });
});
