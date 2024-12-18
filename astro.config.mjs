// @ts-check
// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server', // Enable SSR for Cloudflare Pages
  site: 'https://www.viabrisbane.com', // Replace with your site URL
  integrations: [
    sitemap({
      serialize: (entry) => {
        // Remove trailing slash from the URL
        const url = entry.url.endsWith('/') ? entry.url.slice(0, -1) : entry.url;
        return { ...entry, url };
      },
    }),
  ],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    }
  }),
  vite: {
    build: {
      target: 'esnext',
    },
  },
});