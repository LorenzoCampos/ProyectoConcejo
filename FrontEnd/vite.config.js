import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import PurgeCSSPlugin from 'vite-plugin-purgecss';
import glob from 'glob-all';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    PurgeCSSPlugin({
      content: glob.sync([
        './index.html',
        './src/**/*.{js,jsx,ts,tsx,vue}',  // Ajusta las rutas de tus archivos de código
      ]),
    }),
  ],
  define: {
    global: 'window',
  },
});
