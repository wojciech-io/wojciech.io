import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const SCRIPT = resolve('./scripts/slop-structure.mjs');

interface Report {
  file: string;
  locale: string;
  words: number;
  sentences: number;
  cv: number;
  personPer1k: number;
  personHits: number;
  circularParagraphs: number;
  micDrops: number;
  tricolons: number;
  antitheses: number;
  promiseHeadings: number;
  promiseHeadingText: string[];
  emDashes: number;
}

function run(args: string[]): Report[] {
  const out = execFileSync('node', [SCRIPT, '--json', ...args], { encoding: 'utf8' });
  return JSON.parse(out) as Report[];
}

/** Write an article into a throwaway tree so the locale is read off its directory. */
function fixture(locale: string, body: string): { path: string; cleanup: () => void } {
  const root = mkdtempSync(join(tmpdir(), 'slop-'));
  const dir = locale === 'en' ? root : join(root, locale);
  if (locale !== 'en') mkdirSync(dir, { recursive: true });
  const path = join(dir, 'fixture.mdx');
  writeFileSync(path, `---\ntitle: "Fixture"\n---\n\n${body}\n`);
  return { path, cleanup: () => rmSync(root, { recursive: true, force: true }) };
}

function withFixture(locale: string, body: string, assert: (r: Report) => void) {
  const { path, cleanup } = fixture(locale, body);
  try {
    const [report] = run([path]);
    assert(report);
  } finally {
    cleanup();
  }
}

describe('slop-structure: word boundaries', () => {
  // JavaScript's \b is defined against [A-Za-z0-9_], so it reports a boundary
  // between "ś" and "ci" in "wartości" and matched the Polish pronoun "ci"
  // eleven times in a text containing none. This is the regression test for
  // that: every pattern in the script has to use Unicode lookarounds.
  it('does not find Polish pronouns inside inflected Polish nouns', () => {
    const body = [
      'Zestawienie wartości oraz możliwości bywa mylące dla zespołu handlowego.',
      'Analiza korzyści pokazuje inne liczby dla obu segmentów rynku europejskiego.',
      'Ocena jakości procesu zależy od przyjętych kryteriów oceny wyników.',
    ].join(' ');
    withFixture('pl', body, (r) => {
      expect(r.locale).toBe('pl');
      expect(r.personHits).toBe(0);
    });
  });

  it('still finds a real Polish pronoun', () => {
    withFixture('pl', 'Moje ustalenia są inne. Nasz zespół zmierzył to dwa razy.', (r) => {
      expect(r.personHits).toBeGreaterThan(0);
    });
  });

  // Polish carries person in the verb, so a pronoun count alone scored every
  // Polish article near zero against its English original.
  it('counts a pro-drop Polish verb as first person', () => {
    withFixture('pl', 'Zbudowałem to w dwa tygodnie. Potem przebudowałem cały pipeline.', (r) => {
      expect(r.personHits).toBeGreaterThanOrEqual(2);
    });
  });

  it('does not mistake an instrumental noun for a first-person verb', () => {
    withFixture('pl', 'Rozmawiałem z zespołem przed spotkaniem z klientem.', (r) => {
      // "rozmawiałem" is the verb; "zespołem" is a noun that ends the same way.
      expect(r.personHits).toBe(1);
    });
  });
});

describe('slop-structure: structural tells', () => {
  it('flags a heading that names no subject and spares one that does', () => {
    withFixture('en', '## Why this matters\n\nThe number moved.\n\n## What GPT-6 costs\n\nIt is cheaper.', (r) => {
      expect(r.promiseHeadings).toBe(1);
      expect(r.promiseHeadingText).toEqual(['Why this matters']);
    });
  });

  it('counts a tricolon but not an ordinary sentence with two commas', () => {
    withFixture('en', 'It was fast, cheap and reliable.', (r) => expect(r.tricolons).toBe(1));
    withFixture(
      'en',
      'After we rebuilt the pipeline in March, once the data had settled down, the team finally agreed on a number.',
      (r) => expect(r.tricolons).toBe(0)
    );
  });

  it('counts the antithesis construction in each language it knows', () => {
    withFixture('en', 'This is not a tooling problem, but a routing problem.', (r) =>
      expect(r.antitheses).toBe(1)
    );
    withFixture('pl', 'To nie jest problem narzędzi, tylko problem routingu.', (r) =>
      expect(r.antitheses).toBe(1)
    );
    withFixture('de', 'Das ist nicht ein Werkzeugproblem, sondern ein Routing-Problem.', (r) =>
      expect(r.antitheses).toBe(1)
    );
  });

  it('flags a paragraph whose last sentence adds nothing to the paragraph', () => {
    const circular =
      'Adoption fails because data entry creates friction. ' +
      'The friction comes from manual entry with no personal benefit. ' +
      'Adoption fails because manual entry creates friction with no personal benefit.';
    withFixture('en', circular, (r) => expect(r.circularParagraphs).toBe(1));
  });

  it('leaves a paragraph alone when the last sentence carries something new', () => {
    const straight =
      'Adoption fails because data entry creates friction. ' +
      'Nobody fills in a field that helps somebody else. ' +
      'We moved capture into the calendar sync and the field stopped mattering.';
    withFixture('en', straight, (r) => expect(r.circularParagraphs).toBe(0));
  });

  it('counts em dashes, which the tone spec bans outright', () => {
    withFixture('en', 'The number moved — and then it moved back.', (r) => expect(r.emDashes).toBe(1));
  });
});

describe('slop-structure: sentence splitting', () => {
  it('does not break a sentence on an abbreviation or a decimal', () => {
    withFixture('en', 'The model costs 1.25 USD per million tokens, e.g. for batch work.', (r) => {
      expect(r.sentences).toBe(1);
    });
  });

  it('excludes lists and tables from the prose measurement', () => {
    const body = '- one item here\n- another item here\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\nThis is the only sentence.';
    withFixture('en', body, (r) => expect(r.sentences).toBe(1));
  });
});

describe('slop-structure: the corpus it guards', () => {
  const corpus = run([]);

  it('measures every locale, not only English', () => {
    const locales = new Set(corpus.map((r) => r.locale));
    expect(locales.has('en')).toBe(true);
    expect(locales.has('pl')).toBe(true);
    expect(locales.size).toBeGreaterThan(1);
  });

  it('finds a first- or second-person marker in every article', () => {
    // The tone spec requires first or second person. A zero here means either
    // an article has drifted into the impersonal register or a locale's
    // pattern is missing, and both are worth failing over.
    const impersonal = corpus.filter((r) => r.personHits === 0).map((r) => r.file);
    expect(impersonal).toEqual([]);
  });

  it('keeps em dashes out of published articles', () => {
    const offenders = corpus.filter((r) => r.emDashes > 0).map((r) => `${r.file} (${r.emDashes})`);
    expect(offenders).toEqual([]);
  });
});
