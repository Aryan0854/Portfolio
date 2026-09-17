

import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginImagemin from 'vite-plugin-imagemin';

function crawlableSpaRoutes() {
  const routes = ['projects', 'resume', 'certificates'];
  return {
    name: 'crawlable-spa-routes',
    closeBundle() {
      const dist = resolve(process.cwd(), 'dist');
      const index = resolve(dist, 'index.html');
      const existing = new Set(
        readdirSync(dist).map((name) => name.toLowerCase())
      );
      for (const route of routes) {
        // Skip when public/ already has this folder (e.g. Certificates vs /certificates on Windows).
        if (existing.has(route.toLowerCase())) continue;
        const dir = resolve(dist, route);
        mkdirSync(dir, { recursive: true });
        copyFileSync(index, resolve(dir, 'index.html'));
      }
    },
  };
}

// https://vitejs.dev/config/
const imageMinPlugin = process.env.CI
  ? []
  : [
      vitePluginImagemin({
        gifsicle: { optimizationLevel: 7, interlaced: false },
        optipng: { optimizationLevel: 7 },
        mozjpeg: { quality: 75, progressive: true },
        pngquant: { quality: [0.65, 0.8], speed: 4 },
        svgo: { plugins: [{ removeViewBox: false }] },
      }),
    ];

export default defineConfig({
  plugins: [react(), ...imageMinPlugin, crawlableSpaRoutes()],
  base: '/', // For custom domain deployment
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false, // Disable for production to reduce bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'icon-vendor': ['lucide-react'],
          'three-vendor': ['three'],
        },
      },
    },
  },
  // Improve image handling in dev
  server: {
    fs: {
      strict: false,
    },
  },
  preview: {
    compress: true,
  },
});
