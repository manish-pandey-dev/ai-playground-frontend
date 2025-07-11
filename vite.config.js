// vite.config.js - Modern build configuration for AI Playground

import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: 'index.html',
        auth: 'auth.html'
      }
    }
  },

  // Development server
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true
  },

  // Preview server (for testing builds)
  preview: {
    host: '0.0.0.0',
    port: 4173
  },

  // Plugins for compatibility
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString())
  },

  // Asset optimization
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],

  // CSS configuration
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase'
    }
  }
})