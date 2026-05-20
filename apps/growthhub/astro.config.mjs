// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://gh.wojciech.io',
  server: { port: parseInt(process.env.PORT || '4325') },
  vite: {
    plugins: [tailwindcss()],
  },
});
