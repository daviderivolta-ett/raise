import { defineConfig } from 'vite';
import cesium from 'vite-plugin-cesium';
export default defineConfig({
  plugins: [cesium()],
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: './src/main.js', // Punto di ingresso per la tua pagina principale
        index: './index.html', // Punto di ingresso per index.html
        map: './map.html', // Punto di ingresso per map.html
      },
    }
  }
});