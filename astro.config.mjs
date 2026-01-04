// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

export default defineConfig({
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
      {
        name: 'Inter',
        cssVariable: '--font-inter',
        provider: fontProviders.google(),
        weights: [400, 500, 600, 700],
        styles: ['normal'],
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
