import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://jungle-safari.github.io',
  base: '/kanha-tiger-guide',
  integrations: [
    tailwind(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7
    }),
    mdx()
  ],
  build: {
    format: 'directory'
  },
  compressHTML: true
});
