import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PWA (vite-plugin-pwa) is installed but not configured yet — added in a later phase.
export default defineConfig({
  plugins: [react()],
});
