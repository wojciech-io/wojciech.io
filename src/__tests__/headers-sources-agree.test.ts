import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PUBLIC_SECURITY_HEADERS } from '../../functions/_middleware';

/**
 * The security headers exist twice: as PUBLIC_SECURITY_HEADERS in the Pages
 * Functions middleware, and as the `/*` block in public/_headers. Middleware
 * wins wherever Functions run; _headers covers everything else. Both have to
 * say the same thing.
 *
 * Keeping them in sync was a manual instruction in a code comment, and it
 * failed: dropping the unused Mixpanel origins (#474) landed in the middleware
 * only, and the built _headers kept advertising them until a later check caught
 * it. This test makes that class of drift fail in CI instead.
 */

/** Parse the `/*` catch-all block of a Cloudflare Pages _headers file. */
function parseCatchAllBlock(source: string): Record<string, string> {
  const lines = source.split('\n');
  const start = lines.findIndex((line) => line.trim() === '/*');
  if (start === -1) throw new Error('public/_headers has no /* catch-all block');

  const headers: Record<string, string> = {};
  for (const line of lines.slice(start + 1)) {
    // A non-indented, non-empty line starts the next path block.
    if (line.trim() !== '' && !/^\s/.test(line)) break;
    if (line.trim() === '' || line.trim().startsWith('#')) continue;

    const separator = line.indexOf(':');
    if (separator === -1) continue;
    const name = line.slice(0, separator).trim().toLowerCase();
    headers[name] = line.slice(separator + 1).trim();
  }
  return headers;
}

describe('security headers stay identical across both sources', () => {
  const headersFile = readFileSync(join(process.cwd(), 'public/_headers'), 'utf8');
  const fromHeadersFile = parseCatchAllBlock(headersFile);

  it('public/_headers declares every header the middleware sets', () => {
    expect(Object.keys(fromHeadersFile).sort()).toEqual(
      Object.keys(PUBLIC_SECURITY_HEADERS).sort(),
    );
  });

  it.each(Object.keys(PUBLIC_SECURITY_HEADERS))('%s has the same value in both', (name) => {
    // Cloudflare joins CSP directives with "; ". Normalise whitespace so
    // formatting differences do not register as drift.
    const normalise = (value: string) => value.replace(/\s+/g, ' ').trim();
    expect(normalise(fromHeadersFile[name] ?? '')).toBe(
      normalise(PUBLIC_SECURITY_HEADERS[name]),
    );
  });
});
