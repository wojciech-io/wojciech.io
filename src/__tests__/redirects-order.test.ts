import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Cloudflare Pages counts every rule after the first splat or placeholder as
// dynamic and stops reading after 100 of them, silently. On 2026-09-21 adding
// 140 static rules below /en/* pushed /sitemap.xml, /blog/*, /kade and the
// rest of the file past that limit, and they all returned 404 in production.
const rules = readFileSync(resolve('./public/_redirects'), 'utf-8')
  .split('\n')
  .map((line, i) => ({ line: i + 1, text: line.trim() }))
  .filter(({ text }) => text.length > 0 && !text.startsWith('#'))
  .map(({ line, text }) => {
    const [from, to, code] = text.split(/\s+/);
    return { line, from, to, code, dynamic: from.includes('*') || from.includes(':') };
  });

describe('public/_redirects', () => {
  const firstDynamic = rules.findIndex((r) => r.dynamic);

  it('lists every static rule before the first splat', () => {
    const lateStatic = firstDynamic === -1 ? [] : rules.slice(firstDynamic).filter((r) => !r.dynamic);
    expect(lateStatic.map((r) => `line ${r.line}: ${r.from}`)).toEqual([]);
  });

  it('stays under the 100 dynamic rule limit', () => {
    expect(rules.filter((r) => r.dynamic).length).toBeLessThanOrEqual(100);
  });

  it('uses only status codes Pages accepts', () => {
    const bad = rules.filter((r) => !['200', '301', '302', '303', '307', '308'].includes(r.code ?? '301'));
    expect(bad.map((r) => `line ${r.line}: ${r.from} ${r.code}`)).toEqual([]);
  });
});
