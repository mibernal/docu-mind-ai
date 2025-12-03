import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'shared': path.resolve(__dirname, '../../packages/shared/src'),
      'ai-processor': path.resolve(__dirname, '../../packages/ai-processor/src')
    },
  },
  
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
  build: {
    sourcemap: true,
    rollupOptions: {
      external: ['shared', 'ai-processor'],
    },
  },
})