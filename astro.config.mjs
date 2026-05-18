// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';

const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;

export default defineConfig({
  site: 'https://wojciech.io',
  integrations: [
    mdx(),
    sitemap(),
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
