import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

/* Cover art used to live at one address for its whole life. When a cover was
 * replaced, every browser that had seen the old one kept serving it from disk
 * until the cache entry expired, which `_headers` set to thirty days. Readers
 * went on seeing art that had not been on the site for weeks, and nothing in
 * the repo or on the edge could reach them.
 *
 * Hashing the bytes into the URL makes a changed image a different address, so
 * a stale copy is never asked for again. Resolved at build time, once per file.
 */
const cache = new Map<string, string>();

export function versioned(url: string | undefined): string | undefined {
  if (!url || !url.startsWith('/')) return url;

  const hit = cache.get(url);
  if (hit) return hit;

  // Query and hash are not part of the file name on disk.
  const path = url.split(/[?#]/)[0];
  const file = `${process.cwd()}/public${path}`;
  if (!existsSync(file)) return url;

  const hash = createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 8);
  const out = `${path}?v=${hash}`;
  cache.set(url, out);
  return out;
}
