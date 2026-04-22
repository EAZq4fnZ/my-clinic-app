// src/vitest.config.ts
import path from 'node:path'; // パス操作用
import solidPlugin from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/vitest-setup.ts'], // ここで指定
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
