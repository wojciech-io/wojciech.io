// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';

const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
const noindexSitemapPaths = new Set(['/cv/', '/privacy/', '/apps/', '/subscribe/']);

const isIndexableSitemapUrl = (page) => {
  const url = new URL(page);
  const path = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;

  if (url.hostname !== 'wojciech.io') return false;
  if (path.startsWith('/en/') || path === '/en/') return false;
  if (path.startsWith('/pl/') || path === '/pl/') return false;
  if (path.startsWith('/it/') || path === '/it/') return false;
  if (noindexSitemapPaths.has(path)) return false;

  return true;
};

export default defineConfig({
  site: 'https://wojciech.io',
  integrations: [
    mdx(),
    sitemap({
      filter: isIndexableSitemapUrl,
    }),
    sentry({
      sourceMapsUploadOptions: sentryAuthToken
        ? { org: 'wojciechio', project: 'javascript-astro', authToken: sentryAuthToken }
        : { enabled: false },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
