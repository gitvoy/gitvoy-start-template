import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://younyeojoon.github.io',
  base: '/gitvoy-start-template/',
  vite: {
    plugins: [tailwindcss()],
  },
});
