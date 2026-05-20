// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://academy.wojciech.io',
  server: { port: parseInt(process.env.PORT || '4326') },
  vite: {
    plugins: [tailwindcss()],
  },
});
