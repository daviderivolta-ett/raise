import { defineConfig } from 'vite';
import cesium from 'vite-plugin-cesium';
export default defineConfig({
  plugins: [cesium()],
  build: {
    outDir: 'docs'
  },
  base: '/map/'
});