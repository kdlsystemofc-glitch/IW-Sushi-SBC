import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    port: 5175,
    open: false,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        explore01: resolve(__dirname, 'explore-01.html'),
        explore02: resolve(__dirname, 'explore-02.html'),
        explore03: resolve(__dirname, 'explore-03.html'),
      }
    }
  }
});
