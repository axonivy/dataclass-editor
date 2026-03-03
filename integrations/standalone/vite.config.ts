import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000,
    rollupOptions: { input: { index: './index.html', mock: './mock.html' } }
  },
  server: { port: 3002 },
  resolve: {
    alias: {
      '@axonivy/dataclass-editor': resolve(__dirname, '../../packages/dataclass-editor/src'),
      '@axonivy/dataclass-editor-protocol': resolve(__dirname, '../../packages/protocol/src')
    }
  },
  base: './'
});
