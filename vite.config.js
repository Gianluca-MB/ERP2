import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.', // Define que el punto de entrada sea el directorio raíz
  build: {
    outDir: 'dist', // Carpeta de salida al construir el proyecto
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'src/home.html'), // Asegura que home.html también se procese
      },
    },
  },
  server: {
    port: 5173, // Cambia el puerto si lo deseas
    strictPort: true,
  },
});
