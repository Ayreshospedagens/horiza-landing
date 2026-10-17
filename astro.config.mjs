import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.usehoriza.com.br',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'always' },
});
