// vite.config.ts
import path from 'node:path';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import solidPlugin from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    // 最新のプラグイン形式で設定を明示
    tanstackRouter({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
      target: 'solid',
    }),
    solidPlugin({ hot: false }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    // セットアップファイルのファイル名に注意（ハイフンかドットか）
    setupFiles: ['./src/vitest.setup.ts'],
  },
  resolve: {
    conditions: ['browser', 'development'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@f': path.resolve(__dirname, './src/features'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@testing': path.resolve(__dirname, './src/testing'),
      '@types': path.resolve(__dirname, './src/types'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    target: 'esnext',
  },
});
