import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Production build optimizations
    minify: "esbuild", // Fast minification
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    // Target modern browsers for smaller bundle size
    target: "es2020",
    // Optimize asset handling
    assetsInlineLimit: 4096, // Inline small assets (< 4KB) as base64
    rollupOptions: {
      output: {
        // Code splitting for better caching and faster initial load
        manualChunks: (id) => {
          // Vendor chunk for core dependencies
          if (id.includes('node_modules')) {
            // React core - critical, load first (but split React Router for lazy loading)
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            // Split Radix UI into smaller chunks - only load what's used
            if (id.includes('@radix-ui/react-tooltip')) {
              return 'vendor-ui-tooltip';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            // TanStack Query - can be loaded separately
            if (id.includes('@tanstack')) {
              return 'vendor-query';
            }
            // Lucide icons - split by usage if possible
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Split large dependencies that aren't critical
            if (id.includes('date-fns') || id.includes('recharts') || id.includes('embla-carousel')) {
              return 'vendor-utils';
            }
            // Other vendor dependencies
            return 'vendor';
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Optimize chunk size warnings threshold
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
}));
