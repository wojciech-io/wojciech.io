import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';

/**
 * Regression guard for #207.
 *
 * The /api/changelog.json endpoint silently returned `count=0 source=empty`
 * in production because it loaded shipped.json via runtime fs.readFileSync
 * with a relative path — but Cloudflare Pages only ships dist/ + public/,
 * so src/data/shipped.json was unreachable from the SSG worker bundle.
 *
 * Fix: import the JSON statically so Vite inlines it into the build output.
 *
 * These assertions catch any regression that puts the endpoint back on
 * runtime fs resolution.
 */

const ENDPOINT_PATH = join(process.cwd(), 'src/pages/api/changelog.json.ts');
const ENDPOINT_SRC = readFileSync(ENDPOINT_PATH, 'utf8');

describe('/api/changelog.json endpoint', () => {
  it('imports shipped.json statically (so Vite inlines the data)', () => {
    expect(ENDPOINT_SRC).toMatch(
      /import\s+\w+\s+from\s+['"][^'"]*shipped\.json['"]/,
    );
  });

  it('does not read shipped.json via runtime fs (broke in production)', () => {
    expect(ENDPOINT_SRC).not.toMatch(/readFileSync/);
    expect(ENDPOINT_SRC).not.toMatch(/existsSync/);
  });

  it('does not resolve paths from import.meta.url (worker bundle has no src/)', () => {
    expect(ENDPOINT_SRC).not.toMatch(/fileURLToPath/);
  });
});
