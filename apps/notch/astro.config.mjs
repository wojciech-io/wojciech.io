// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://notch.wojciech.io',
  server: { port: parseInt(process.env.PORT || '4324') },
  vite: {
    plugins: [tailwindcss()],
  },
});
