import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    watch: {
      usePolling: true, // Required for Docker on some systems
    },
    hmr: {
      host: 'localhost',
      port: 5173,
    },
  },
});

