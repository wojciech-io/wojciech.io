// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { ALL_LOCALES } from './src/data/locale-codes.ts';

const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
const sentryDsn = process.env.PUBLIC_SENTRY_DSN ?? 'https://eeed3e8af9a62f73f7ae309873dddc50@o4511411558678528.ingest.de.sentry.io/4511411564314704';
const noindexSitemapPaths = new Set(['/cv/', '/privacy/', '/stack/', '/status/', '/subscribe/', '/bites/']);

const articleLocales = ALL_LOCALES;
/** @returns {Map<string, string>} locale:slug → ISO date string (YYYY-MM-DD) */
function buildArticleDateMap() {
  const map = new Map();
  // Auto-discover all article slugs from the content directory
  const insightsDir = new URL('./src/content/insights/', import.meta.url);
  const slugs = readdirSync(insightsDir)
    .filter((/** @type {string} */ f) => f.endsWith('.mdx') && !f.includes('/'))
    .map((/** @type {string} */ f) => f.replace('.mdx', ''));

  for (const locale of articleLocales) {
    for (const slug of slugs) {
      const prefix = locale === 'en' ? '' : `${locale}/`;
      const filePath = new URL(`./src/content/insights/${prefix}${slug}.mdx`, import.meta.url);
      if (!existsSync(filePath)) continue;
      try {
        const content = readFileSync(filePath, 'utf-8');
        const match = content.match(/publishedAt:\s*["']?(\d{4}-\d{2}-\d{2})["']?/);
        if (!match) continue;
        map.set(`${locale}:${slug}`, match[1]);
      } catch { /* locale article doesn't exist, skip */ }
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
  if (path.startsWith('/decks/')) return false;
  if (path.startsWith('/og/')) return false;
  if (path.endsWith('/cv/')) return false;
  // /meet and /[locale]/meet render the same BookingScheduler that /contact
  // embeds. /contact is the canonical booking page, so /meet stays reachable as
  // a short link but out of the sitemap.
  if (path.endsWith('/meet/')) return false;
  if (noindexSitemapPaths.has(path)) return false;

  return true;
};

// @ts-ignore — sitemap uses EnumChangefreq which can't be expressed in JSDoc .mjs
const serializeSitemapItem = (/** @type {any} */ item) => {
  const path = new URL(item.url).pathname;
  const articleMatch = path.match(/^\/(?:(de|dk|no|jp|it|es|pl)\/)?insights\/([^/]+)\//);
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
  // Prewarm every in-viewport link on idle. Without this, ClientRouter does a
  // cold fetch of the full (CSS-inlined) document on every tap — on mobile,
  // where there is no hover to warm the default 'hover' strategy, that cold
  // fetch is the multi-second stall before any new page appears. 'viewport'
  // fetches links as they scroll into view so a tap hits a warm cache.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
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
