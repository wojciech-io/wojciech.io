import type { APIRoute } from 'astro';

const BUILD_TIME = new Date().toISOString();
const COMMIT = process.env.CF_PAGES_COMMIT_SHA ?? process.env.GITHUB_SHA ?? 'local';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      status: 'ok',
      service: 'wojciech.io',
      build: BUILD_TIME,
      commit: COMMIT.slice(0, 7),
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=60',
      },
    },
  );
