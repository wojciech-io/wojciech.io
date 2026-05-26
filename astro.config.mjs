// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';
import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
const sentryDsn = process.env.PUBLIC_SENTRY_DSN ?? 'https://eeed3e8af9a62f73f7ae309873dddc50@o4511411558678528.ingest.de.sentry.io/4511411564314704';
const noindexSitemapPaths = new Set(['/cv/', '/privacy/', '/apps/', '/subscribe/']);

/** @returns {Map<string, string>} slug → ISO date string (YYYY-MM-DD) */
function buildArticleDateMap() {
  const map = new Map();
  const dir = resolve('./src/content/insights');
  for (const file of readdirSync(dir).filter(f => /\.(md|mdx)$/.test(f))) {
    const content = readFileSync(resolve(dir, file), 'utf-8');
    const match = content.match(/publishedAt:\s*(.+)/);
    if (!match) continue;
    const date = new Date(match[1].trim());
    if (!isNaN(date.getTime())) {
      map.set(file.replace(/\.mdx?$/, ''), date.toISOString().split('T')[0]);
    }
  }
  return map;
}

const articleDates = buildArticleDateMap();
const SITE_LASTMOD = new Date().toISOString().split('T')[0];

const isIndexableSitemapUrl = (/** @type {string} */ page) => {
  const url = new URL(page);
  const path = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;

  if (url.hostname !== 'wojciech.io') return false;
  if (path.startsWith('/en/') || path === '/en/') return false;
  if (path.startsWith('/pl/') || path === '/pl/') return false;
  if (path.startsWith('/it/') || path === '/it/') return false;
  if (noindexSitemapPaths.has(path)) return false;

  return true;
};

/** @param {import('@astrojs/sitemap').SitemapItem} item */
const serializeSitemapItem = (item) => {
  const path = new URL(item.url).pathname;
  const articleMatch = path.match(/^\/insights\/([^/]+)\//);
  if (articleMatch) {
    const slug = articleMatch[1];
    return { ...item, lastmod: articleDates.get(slug) ?? SITE_LASTMOD, changefreq: 'monthly', priority: 0.8 };
  }
  if (path === '/') return { ...item, lastmod: SITE_LASTMOD, changefreq: 'weekly', priority: 1.0 };
  if (path === '/insights/') return { ...item, lastmod: SITE_LASTMOD, changefreq: 'weekly', priority: 0.9 };
  if (['/about/', '/work/', '/ai-systems/', '/contact/', '/now/', '/resources/'].includes(path)) {
    return { ...item, lastmod: SITE_LASTMOD, changefreq: 'monthly', priority: 0.7 };
  }
  return { ...item, lastmod: SITE_LASTMOD, changefreq: 'monthly', priority: 0.5 };
};

export default defineConfig({
  site: 'https://wojciech.io',
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [
    mdx(),
    sitemap({
      filter: isIndexableSitemapUrl,
      serialize: serializeSitemapItem,
    }),
    sentry({
      enabled: {
        client: Boolean(sentryDsn),
        server: false,
      },
      clientInitPath: './sentry.client.config.js',
      bundleSizeOptimizations: {
        excludeTracing: true,
      },
      sourceMapsUploadOptions: sentryAuthToken
        ? { org: 'wojciechio', project: 'javascript-astro', authToken: sentryAuthToken }
        : { enabled: false },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
