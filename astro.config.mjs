// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://slvlkn.cc',
  output: 'server',
  adapter: vercel({}),

  build: {
    inlineStylesheets: 'always',
  },

  experimental: {
    fonts: [
      {
        name: 'Space Grotesk',
        cssVariable: '--font-space-grotesk',
        provider: fontProviders.google(),
        weights: [400, 500, 600, 700],
        styles: ['normal', 'italic'],
        subsets: ['latin'],
        fallbacks: ['system-ui', 'sans-serif'],
      },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});
