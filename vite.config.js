import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Handling __dirname in ESM (EcmaScript Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * LeadPilot Premium Vite Configuration
 * Optimized for: AI processing, heavy charting, and instant loading.
 */
export default defineConfig({
  plugins: [
    react({
      // Optimized Fast Refresh for faster development of AI components
      include: "**/*.{jsx,tsx}",
    }),
  ],
  resolve: {
    alias: {
      // Clean Imports: Use '@/components/...' instead of '../../../components/...'
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Premium Performance: Splits code into smaller chunks for faster initial load
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', 'framer-motion', 'sonner'],
          'vendor-charts': ['recharts'],
          // CORREÇÃO: Removido 'openai' e adicionado o Google AI SDK
          'vendor-ai': ['@google/generative-ai'],
        },
      },
    },
    // Minimizes the chance of visual bugs during heavy AI computations
    target: 'esnext',
    sourcemap: false, // Set to true only if you need to debug production
    minify: 'esbuild',
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true, // Enables access from your mobile device via local network
  },
});
