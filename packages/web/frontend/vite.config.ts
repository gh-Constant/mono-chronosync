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
  preview: {
    port: 4173,
    host: true, // Listen on all addresses
    strictPort: true
  },
  server: {
    port: 4173,
    host: true, // Listen on all addresses
    strictPort: true
  }
})
