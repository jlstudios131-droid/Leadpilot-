import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * LeadPilot IA - Vite Configuration (TypeScript Version)
 * Optimized for: Zero-error deployments and strict path resolution.
 */
export default defineConfig({
  plugins: [
    react({
      // Strict inclusion for TSX/JSX
      include: "**/*.{tsx,jsx}",
    }),
  ],
  resolve: {
    alias: {
      // Direct absolute path mapping
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Advanced code splitting to prevent "White Screen" on slow connections
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'framer-motion', 'sonner', 'clsx', 'tailwind-merge'],
          'ai-vendor': ['@google/generative-ai'],
          'db-vendor': ['@supabase/supabase-js'],
          'chart-vendor': ['recharts'],
        },
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  },
});
