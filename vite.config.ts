
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginImagemin from 'vite-plugin-imagemin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePluginImagemin({
      gifsicle: { optimizationLevel: 7, interlaced: false },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 75 },
      pngquant: { quality: [0.65, 0.8], speed: 4 },
      svgo: { plugins: [{ removeViewBox: false }] },
    }),
  ],
  base: '/Portfolio/', // Match your GitHub Pages repository name
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
});
