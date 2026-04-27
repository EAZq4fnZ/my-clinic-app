// vitest.config.ts
import path from 'node:path';
import solidPlugin from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [solidPlugin({ hot: false, dev: false })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/testing/setup.tsx'],
    testTimeout: 10000,
  },
  resolve: {
    conditions: ['browser', 'development'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@testing': path.resolve(__dirname, './src/testing'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
});
