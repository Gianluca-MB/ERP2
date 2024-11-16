import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // Asegura que Vite use la raíz del proyecto
  server: {
    port: 5173, // Puerto predeterminado
    strictPort: false, // Permite cambiar de puerto automáticamente si el predeterminado está ocupado
    host: true, // Hace que el servidor sea accesible en la red local (útil para pruebas en otros dispositivos)
  },
  build: {
    outDir: 'dist', // Carpeta de salida al construir
  },
});
