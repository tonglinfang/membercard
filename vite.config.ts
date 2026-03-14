import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  // 相対パスに設定することで、リポジトリ名に関わらず動作するようにします
  base: './',
  
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})