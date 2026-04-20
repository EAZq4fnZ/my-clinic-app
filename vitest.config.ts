// vitest.config.ts
import { defineConfig } from 'vitest/config';
import solidPlugin from 'vite-plugin-solid';
import path from 'node:path'; // パス操作用

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    conditions: ['browser', 'development'],
    alias: {
      // ★ ここにエイリアスをすべて追加します
      '@': path.resolve(__dirname, './src'),
      '@f': path.resolve(__dirname, './src/features'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@types': path.resolve(__dirname, './src/types'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@utils': path.resolve(__dirname, './src/utils'),
     },
  },
});