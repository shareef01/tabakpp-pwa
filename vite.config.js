import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// NUCLEAR CACHE BUSTING: Forced Signature Change
const BUILD_SIGNATURE = "V30_GOLDEN_RESTORED_" + Date.now();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_TIME__: JSON.stringify(BUILD_SIGNATURE),
  },
  build: {
    manifest: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Enforce unique names for all assets to bust CDN and Browser caches
        entryFileNames: `assets/core.[hash].${BUILD_SIGNATURE}.js`,
        chunkFileNames: `assets/module.[hash].${BUILD_SIGNATURE}.js`,
        assetFileNames: `assets/style.[hash].${BUILD_SIGNATURE}.[ext]`
      }
    }
  }
})
