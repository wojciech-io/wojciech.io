// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';

const sentryDsn = process.env.PUBLIC_SENTRY_DSN;

export default defineConfig({
  site: 'https://wojciech.io',
  integrations: [
    mdx(),
    sitemap(),
    ...(sentryDsn ? [sentry({ sourceMapsUploadOptions: { enabled: false } })] : []),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
