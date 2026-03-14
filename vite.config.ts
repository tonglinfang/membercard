import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // GitHub Pages のリポジトリ名が 'membercard' の場合はこれ
  // もしパスが正しくない場合は、コンソールに 404 エラーが出ます
  base: '/membercard/',
  
  // ビルド時に型チェックをスキップしない設定
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})