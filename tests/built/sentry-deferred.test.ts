import { describe, it, expect, beforeAll } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { DIST, html, requireDist, text } from './helpers';

/**
 * Sentry is about 53 KB over the wire and nothing on a marketing page needs it before the page is
 * usable, so sentry.client.config.js loads it after `load`. Two ways to break that without a single
 * test failing: put the SDK back into a script every page loads first, or "simplify" the lazy module
 * to `import('@sentry/astro')`. A dynamic import of the whole package keeps every export, and the
 * lazy chunk grew from 53 KB to 138 KB. This reads the sources and the build for both.
 */

const SDK_MARKER = '__SENTRY__';
const LAZY_GZIP_BUDGET = 80 * 1024;

function moduleScripts(page: string): string[] {
  const out: string[] = [];
  for (const [, src] of page.matchAll(/<script[^>]*\bsrc="(\/_astro\/[^"]+\.js)"/g)) out.push(src);
  return out;
}

describe('Sentry stays off the critical path', () => {
  beforeAll(() => requireDist());

  it('loads the SDK from a separate module, not from the client config', () => {
    const config = readFileSync(join(process.cwd(), 'sentry.client.config.js'), 'utf8');
    const lazy = readFileSync(join(process.cwd(), 'sentry.lazy.js'), 'utf8');
    expect(config).not.toMatch(/from\s+['"]@sentry\/astro['"]/);
    expect(config).not.toMatch(/import\(\s*['"]@sentry\/astro['"]\s*\)/);
    expect(config).toMatch(/import\(\s*['"]\.\/sentry\.lazy\.js['"]\s*\)/);
    expect(lazy).toMatch(/import\s+\*\s+as\s+Sentry\s+from\s+['"]@sentry\/astro['"]/);
    expect(lazy).not.toMatch(/import\(\s*['"]@sentry\/astro['"]\s*\)/);
  });

  it.each(['/', '/contact/', '/de/'])('%s ships no SDK in the scripts it loads first', (path) => {
    const scripts = moduleScripts(html(path));
    expect(scripts.length).toBeGreaterThan(0);
    for (const src of scripts) {
      expect(text(src), `${src} on ${path}`).not.toContain(SDK_MARKER);
    }
  });

  it('keeps the lazy chunk tree-shaken and still in the build', () => {
    const dir = join(DIST, '_astro');
    const holders = readdirSync(dir)
      .filter((name) => name.endsWith('.js'))
      // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal
      // name comes from readdirSync over the build output directory.
      .map((name) => ({ name, body: readFileSync(join(dir, name)) }))
      .filter(({ body }) => body.includes(SDK_MARKER));
    expect(holders, 'the Sentry SDK must still be in the build').toHaveLength(1);
    expect(gzipSync(holders[0].body).length, `${holders[0].name} gzip bytes`).toBeLessThan(LAZY_GZIP_BUDGET);
  });
});
