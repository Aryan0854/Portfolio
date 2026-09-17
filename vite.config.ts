

import { copyFileSync, existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginImagemin from 'vite-plugin-imagemin';

function isCaseSensitiveFs(dir: string) {
  const upper = resolve(dir, '.CaseProbeA');
  const lower = resolve(dir, '.caseprobea');
  try {
    writeFileSync(upper, '1');
    const sensitive = !existsSync(lower);
    unlinkSync(upper);
    return sensitive;
  } catch {
    return true;
  }
}

function crawlableSpaRoutes() {
  const routes = ['projects', 'resume', 'certificates'];
  return {
    name: 'crawlable-spa-routes',
    closeBundle() {
      const dist = resolve(process.cwd(), 'dist');
      const index = resolve(dist, 'index.html');
      const names = readdirSync(dist);
      const caseSensitive = isCaseSensitiveFs(dist);
      for (const route of routes) {
        const clash = names.find(
          (name) => name.toLowerCase() === route.toLowerCase() && name !== route
        );
        // Windows cannot keep Certificates/ and certificates/ as separate folders.
        if (clash && !caseSensitive) continue;
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
