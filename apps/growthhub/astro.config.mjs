// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gh.wojciech.io',
  server: { port: parseInt(process.env.PORT || '4325') },
  integrations: [
    sitemap({
      filter: (page) => page.endsWith('/demo/') || page.endsWith('/demo'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
