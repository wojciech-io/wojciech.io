// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://academy.wojciech.io',
  server: { port: parseInt(process.env.PORT || '4326') },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/app/') &&
        !page.endsWith('/login/') &&
        !page.endsWith('/login') &&
        !page.endsWith('/thanks/') &&
        !page.endsWith('/thanks'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
