import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Inject a unique build timestamp to force UI updates
    __BUILD_TIME__: JSON.stringify(Date.now()),
  },
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        // Break cache by including timestamp in every asset name
        entryFileNames: `assets/[name].[hash].${Date.now()}.js`,
        chunkFileNames: `assets/[name].[hash].${Date.now()}.js`,
        assetFileNames: `assets/[name].[hash].${Date.now()}.[ext]`
      }
    }
  }
})
