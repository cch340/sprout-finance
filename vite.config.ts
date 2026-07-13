import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Sprout is a local-first PWA — precache the app shell + fonts so it works offline.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'fonts/*.woff2'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,svg,png,ico}'],
      },
      manifest: {
        name: 'Sprout',
        short_name: 'Sprout',
        description: 'A warm, calm shared-money PWA for couples and families.',
        theme_color: '#4F8A6B',
        background_color: '#F4F5F1',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});
