import { describe, it, expect } from 'vitest';
import { cvData } from '../data/cv';
import type { CvLang } from '../data/cv';

const LANGS: CvLang[] = ['en', 'pl', 'it'];

function allLangs(obj: Record<string, unknown>) {
  for (const lang of LANGS) {
    expect(typeof obj[lang], `missing lang "${lang}"`).toBe('string');
    expect((obj[lang] as string).length, `empty lang "${lang}"`).toBeGreaterThan(0);
  }
}

describe('cvData structure', () => {
  it('has all three languages in meta.title', () => allLangs(cvData.meta.title));
  it('has all three languages in meta.description', () => allLangs(cvData.meta.description));

  it('has all three languages in each section label', () => {
    for (const [key, val] of Object.entries(cvData.sections)) {
      for (const lang of LANGS) {
        expect(typeof (val as Record<string, unknown>)[lang], `sections.${key} missing "${lang}"`).toBe('string');
      }
    }
  });

  it('has all three languages in header fields', () => {
    for (const [key, val] of Object.entries(cvData.header)) {
      for (const lang of LANGS) {
        expect(typeof (val as Record<string, unknown>)[lang], `header.${key} missing "${lang}"`).toBe('string');
      }
    }
  });

  it('has at least one experience entry', () => {
    expect(cvData.experience.length).toBeGreaterThan(0);
  });

  it.each(cvData.experience.map((e, i) => ({ entry: e, i })))(
    'experience[$i] ($entry.company): role has all langs',
    ({ entry }) => allLangs(entry.role),
  );

  it.each(cvData.experience.map((e, i) => ({ entry: e, i })))(
    'experience[$i] ($entry.company): bullets same length across langs',
    ({ entry }) => {
      const lengths = LANGS.map((l) => entry.bullets[l].length);
      expect(lengths[0], `${entry.company}: bullet length mismatch`).toBe(lengths[1]);
      expect(lengths[0], `${entry.company}: bullet length mismatch`).toBe(lengths[2]);
    },
  );

  it.each(cvData.experience.map((e, i) => ({ entry: e, i })))(
    'experience[$i] ($entry.company): each bullet non-empty across langs',
    ({ entry }) => {
      for (const lang of LANGS) {
        for (const bullet of entry.bullets[lang]) {
          expect(bullet.length, `${entry.company} "${lang}" has empty bullet`).toBeGreaterThan(0);
        }
      }
    },
  );

  it('skills has all three langs with at least one item each', () => {
    for (const lang of LANGS) {
      expect(Array.isArray(cvData.skills[lang]), `skills missing "${lang}"`).toBe(true);
      expect(cvData.skills[lang].length, `skills["${lang}"] is empty`).toBeGreaterThan(0);
    }
  });

  it('skills same length across langs', () => {
    const lengths = LANGS.map((l) => cvData.skills[l].length);
    expect(lengths[0]).toBe(lengths[1]);
    expect(lengths[0]).toBe(lengths[2]);
  });

  it('tools is non-empty array of strings', () => {
    expect(Array.isArray(cvData.tools)).toBe(true);
    expect(cvData.tools.length).toBeGreaterThan(0);
    for (const t of cvData.tools) {
      expect(typeof t).toBe('string');
      expect(t.length).toBeGreaterThan(0);
    }
  });

  it('certifications have name and issuer', () => {
    for (const cert of cvData.certifications) {
      expect(typeof cert.name).toBe('string');
      expect(cert.name.length).toBeGreaterThan(0);
      expect(typeof cert.issuer).toBe('string');
    }
  });
});
