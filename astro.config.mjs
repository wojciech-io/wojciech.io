// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';
import { readFileSync } from 'fs';

const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
const sentryDsn = process.env.PUBLIC_SENTRY_DSN ?? 'https://eeed3e8af9a62f73f7ae309873dddc50@o4511411558678528.ingest.de.sentry.io/4511411564314704';
const noindexSitemapPaths = new Set(['/cv/', '/privacy/', '/apps/', '/subscribe/', '/stack/']);

const articleLocales = ['en', 'de', 'dk', 'no', 'jp'];
const articleSlugs = [
  'ai-production-stack',
  'claude-code-client-gtm',
  'claude-code-vs-clay',
  'crm-first-ai-adoption',
];

function articleFileUrl(/** @type {string} */ locale, /** @type {string} */ slug) {
  const prefix = locale === 'en' ? '' : `${locale}/`;
  return new URL(`./src/content/insights/${prefix}${slug}.mdx`, import.meta.url);
}

/** @returns {Map<string, string>} locale:slug → ISO date string (YYYY-MM-DD) */
function buildArticleDateMap() {
  const map = new Map();
  for (const locale of articleLocales) {
    for (const slug of articleSlugs) {
      const content = readFileSync(articleFileUrl(locale, slug), 'utf-8');
      const match = content.match(/publishedAt:\s*(.+)/);
      if (!match) continue;
      const date = new Date(match[1].trim());
      if (!isNaN(date.getTime())) {
        map.set(`${locale}:${slug}`, date.toISOString().split('T')[0]);
      }
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
  const articleMatch = path.match(/^\/(?:(de|dk|no|jp)\/)?insights\/([^/]+)\//);
  if (articleMatch) {
    const locale = articleMatch[1] ?? 'en';
    const slug = articleMatch[2];
    return { ...item, lastmod: articleDates.get(`${locale}:${slug}`) ?? SITE_LASTMOD, changefreq: 'monthly', priority: 0.8 };
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
