import type { APIRoute } from 'astro';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/**
 * Public changelog endpoint.
 *
 * Reads src/data/shipped.json (generated at build time from squash-merged
 * PRs on main — see scripts/generate-shipped.mjs) and exposes it as a stable,
 * documented JSON contract for downstream consumers:
 *   - the /roadmap "Shipped recently" UI section
 *   - the /status surface health board
 *   - external monitors / newsletter automation
 *
 * Fail-soft: if shipped.json is missing or unparseable (e.g. during a
 * partial deploy, or a fresh checkout before the prebuild runs), returns
 * an empty list with a status hint so callers don't have to special-case
 * 404s. Schema is versioned so we can evolve without breaking clients.
 */

const SHIPPED_JSON = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../data/shipped.json',
);

interface ShippedEntry {
  number: number;
  type: string;
  scope: string | null;
  title: string;
  mergedAt: string;
  sha: string;
}

const BUILD_TIME = new Date().toISOString();
const COMMIT = process.env.CF_PAGES_COMMIT_SHA ?? process.env.GITHUB_SHA ?? 'local';

function loadEntries(): { entries: ShippedEntry[]; source: 'shipped.json' | 'empty' } {
  if (!existsSync(SHIPPED_JSON)) return { entries: [], source: 'empty' };
  try {
    const raw = readFileSync(SHIPPED_JSON, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return { entries: [], source: 'empty' };
    return { entries: parsed as ShippedEntry[], source: 'shipped.json' };
  } catch {
    return { entries: [], source: 'empty' };
  }
}

export const GET: APIRoute = () => {
  const { entries, source } = loadEntries();
  return new Response(
    JSON.stringify(
      {
        version: 1,
        service: 'wojciech.io',
        endpoint: '/api/changelog.json',
        build: BUILD_TIME,
        commit: COMMIT.slice(0, 7),
        source,
        count: entries.length,
        entries,
      },
      null,
      2,
    ),
    {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        // Short cache so the surface stays fresh between deploys, but
        // CDN can still absorb traffic spikes from monitors/automations.
        'cache-control': 'public, max-age=300, s-maxage=300',
      },
    },
  );
};
