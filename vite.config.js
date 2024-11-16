import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // Define la raíz del proyecto
  build: {
    outDir: 'dist', // Carpeta de salida al construir
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
