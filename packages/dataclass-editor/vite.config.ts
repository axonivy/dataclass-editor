import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: './tsconfig.production.json' })],
  esbuild: {
    sourcemap: 'inline'
  },
  build: {
    outDir: 'lib',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'editor',
      formats: ['es']
    },
    rollupOptions: {
      external: [
        '@axonivy/ui-components',
        '@axonivy/ui-icons',
        '@tanstack/react-query',
        'react',
        'react-error-boundary',
        'react/jsx-runtime',
        'react-dom'
      ]
    }
  }
});
