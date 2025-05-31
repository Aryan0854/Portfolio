
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Portfolio/', // Change to match your repository name with slashes
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
