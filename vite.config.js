import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const BUILD_SIGNATURE = 'V30_GOLDEN_RESTORED_' + Date.now();

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'T++ Registry Node',
        short_name: 'T++',
        description: 'High-fidelity RYO habit tracking and economic analytics node.',
        theme_color: '#09090B',
        background_color: '#09090B',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/track',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  define: {
    __BUILD_TIME__: JSON.stringify(BUILD_SIGNATURE),
  },
  build: {
    manifest: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/core.[hash].${BUILD_SIGNATURE}.js`,
        chunkFileNames: `assets/module.[hash].${BUILD_SIGNATURE}.js`,
        assetFileNames: `assets/style.[hash].${BUILD_SIGNATURE}.[ext]`,
      },
    },
  },
})
