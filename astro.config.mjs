import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://usehoriza.com.br',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'always' },
});
