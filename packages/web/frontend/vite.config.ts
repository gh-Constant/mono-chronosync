import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 4173,
    host: true, // Listen on all addresses
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.BASE_API_URL,
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    allowedHosts: true,
    proxy: {
      '/api': {
        target: process.env.BASE_API_URL,
        changeOrigin: true,
        secure: false
      }
    }
  }
})