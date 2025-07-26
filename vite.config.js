// vite.config.js - Replace your existing vite.config.js with this
import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        auth: resolve(process.cwd(), 'auth.html')
      }
    }
  },

  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://ai-playground-421016501960.europe-west4.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },

  preview: {
    host: '0.0.0.0',
    port: 4173
  },

  resolve: {
    alias: {
      '@': resolve(process.cwd(), 'src'),
      '@components': resolve(process.cwd(), 'src/components'),
      '@services': resolve(process.cwd(), 'src/services'),
      '@stores': resolve(process.cwd(), 'src/stores'),
      '@utils': resolve(process.cwd(), 'src/utils'),
      '@styles': resolve(process.cwd(), 'src/styles'),
      '@assets': resolve(process.cwd(), 'src/assets')
    }
  },

  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],

  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString())
  },

  css: {
    devSourcemap: true
  }
})