import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BUILD_ID = Date.now();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_TIME__: JSON.stringify(BUILD_ID),
  },
  build: {
    manifest: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Enforce unique names for all assets to bust CDN and Browser caches
        entryFileNames: `assets/[name].${BUILD_ID}.js`,
        chunkFileNames: `assets/[name].[hash].${BUILD_ID}.js`,
        assetFileNames: `assets/[name].[hash].${BUILD_ID}.[ext]`
      }
    }
  }
})
