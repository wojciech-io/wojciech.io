import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { AGENT_SLUGS } from '../lib/clusters';

/**
 * The agents band on the insights index is an explicit list of slugs. A slug
 * that is misspelled, or that outlives a deleted article, does not fail the
 * build: the band just loses a piece and nobody sees where it went. So every
 * name has to point at a published English article, and the one pillar the
 * band exists for has to stay in it.
 */

const ROOT = resolve('./src/content/insights');

describe('agents cluster', () => {
  it('names only English articles that exist', () => {
    const missing = [...AGENT_SLUGS].filter((slug) => !existsSync(resolve(ROOT, `${slug}.mdx`)));
    expect(missing).toEqual([]);
  });

  it('lists no draft', () => {
    const drafts = [...AGENT_SLUGS].filter((slug) =>
      /^draft: true/m.test(readFileSync(resolve(ROOT, `${slug}.mdx`), 'utf8').split('---')[1] ?? '')
    );
    expect(drafts).toEqual([]);
  });

  it('keeps the pillar in the band', () => {
    expect(AGENT_SLUGS.has('autonomous-ai-agents-compared')).toBe(true);
  });
});
