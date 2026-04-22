// src/vitest-setup.ts
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';

if (typeof window !== 'undefined') {
  // HTMLSelectElement が options を持っていない場合のエラーを防ぐためのスタブ
  if (!('options' in HTMLSelectElement.prototype)) {
    Object.defineProperty(HTMLSelectElement.prototype, 'options', {
      get() {
        return this.getElementsByTagName('option');
      },
    });
  }
}
