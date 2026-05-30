import type { APIRoute } from 'astro';
import shippedData from '../../data/shipped.json';

/**
 * Public changelog endpoint.
 *
 * Imports src/data/shipped.json (generated at build time from squash-merged
 * PRs on main — see scripts/generate-shipped.mjs) and exposes it as a stable,
 * documented JSON contract for downstream consumers:
 *   - the /roadmap "Shipped recently" UI section
 *   - the /status surface health board
 *   - external monitors / newsletter automation
 *
 * Static import so Vite bundles the data into the serverless function.
 * Runtime fs reads break on Cloudflare Pages — src/data/ is not deployed
 * alongside dist/_worker.js.
 *
 * Schema is versioned so we can evolve without breaking clients.
 */

interface ShippedEntry {
  number: number;
  type: string;
  scope: string | null;
  title: string;
  mergedAt: string;
  sha: string;
}

const ENTRIES: ShippedEntry[] = Array.isArray(shippedData)
  ? (shippedData as ShippedEntry[])
  : [];

const BUILD_TIME = new Date().toISOString();
const COMMIT = process.env.CF_PAGES_COMMIT_SHA ?? process.env.GITHUB_SHA ?? 'local';

export const GET: APIRoute = () => {
  const entries = ENTRIES;
  const source: 'shipped.json' | 'empty' = entries.length > 0 ? 'shipped.json' : 'empty';
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
