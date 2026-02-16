// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://nardiniseguros.com.br',
  integrations: [react(), icon(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});
