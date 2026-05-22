// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://notch.wojciech.io',
  server: { port: parseInt(process.env.PORT || '4324') },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
