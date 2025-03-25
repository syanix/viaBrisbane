// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server', // Enable SSR for Cloudflare Pages, we'll use per-page prerendering
  site: 'https://www.viabrisbane.com', // Replace with your site URL
  // Content collections are enabled by default in Astro 2.0+
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
      persist: true
    },
  }),
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ["better-sqlite3", "fs"], // Exclude better-sqlite3 and Node.js built-ins
    },
    build: {
      target: 'esnext',
    },
    optimizeDeps: {
      include: ["@cloudflare/workers-types"]
    },
    resolve: {
      alias: {
        "@cloudflare/workers-types": "node_modules/@cloudflare/workers-types/2023-07-01/index.d.ts",
      },
    },
  },
});
