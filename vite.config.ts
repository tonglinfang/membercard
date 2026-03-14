import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  // GitHub Pages のリポジトリ名
  base: '/membercard/',
  
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})