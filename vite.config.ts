import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { SERVICE_SEO, SITE_ORIGIN } from './src/data/serviceSeo.ts';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'service-sitemap',
        apply: 'build',
        generateBundle() {
          const urls = [...SERVICE_SEO.keys()].map((pathname) => `  <url><loc>${SITE_ORIGIN}${pathname}</loc></url>`);
          this.emitFile({
            type: 'asset',
            fileName: 'sitemap.xml',
            source: ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, '</urlset>', ''].join('\n'),
          });
          this.emitFile({
            type: 'asset',
            fileName: 'robots.txt',
            source: `Sitemap: ${SITE_ORIGIN}/sitemap.xml\n`,
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
