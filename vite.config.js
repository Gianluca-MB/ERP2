import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.', // Define la raíz del proyecto
  build: {
    outDir: 'dist', // Carpeta de salida
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'), // Incluye index.html
        home: resolve(__dirname, 'home.html'),  // Incluye home.html
      },
    },
  },
  server: {
    port: 5173, // Cambia el puerto si es necesario
    strictPort: true,
  },
});
