// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://dev.wojciech.io',
  server: { port: parseInt(process.env.PORT || '4329') },
  // No sitemap — dashboard MUST NOT be indexed
  vite: {
    plugins: [tailwindcss()],
  },
});
