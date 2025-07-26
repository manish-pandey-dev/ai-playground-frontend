import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    historyApiFallback: true, // This enables SPA routing
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@services': '/src/services',
      '@stores': '/src/stores',
      '@utils': '/src/utils',
      '@styles': '/src/styles'
    }
  }
})