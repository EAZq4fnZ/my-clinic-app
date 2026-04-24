import '@testing-library/jest-dom'; // 便利なMatcherを使う場合
import { vi } from 'vitest';

// src/vitest.config.ts
import path from 'node:path'; // パス操作用
import solidPlugin from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/testing/setup.ts'], // ここで指定
  },
  resolve: {
    conditions: ['browser', 'development'],
    alias: {
      // ★ ここにエイリアスをすべて追加します
      '@': path.resolve(__dirname, './src'),
      '@f': path.resolve(__dirname, './src/features'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@testing': path.resolve(__dirname, './src/testing'),
      '@types': path.resolve(__dirname, './src/types'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
});

// 全テストで共通のコンポーネントモック
vi.mock('@ui/shared/FieldLayout', () => ({
  FieldLayout: (props: any) => <div data-testid="field-layout">{props.children}</div>,
}));

vi.mock('solid-js/web', async () => {
  const actual = await vi.importActual('solid-js/web');
  return { ...actual, Portal: (props: any) => <>{props.children}</> };
});