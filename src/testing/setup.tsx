// src/testing/setup.tsx
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// 1. PointerEvent の完全なポリフィル
if (typeof window !== 'undefined' && !window.PointerEvent) {
  class PointerEvent extends MouseEvent {
    public pointerId: number;
    public pointerType: string;

    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerId = params.pointerId || 0;
      this.pointerType = params.pointerType || 'mouse';
    }
  }
  window.PointerEvent = PointerEvent as any;
}

// 2. fetch のポリフィル
if (!globalThis.fetch) {
  const { fetch, Headers, Request, Response } = await import('undici');
  Object.assign(globalThis, { fetch, Headers, Request, Response });
}

// 3. UIコンポーネントのモック
vi.mock('@ui/shared/FieldLayout', () => ({
  FieldLayout: (props: any) => (
    <div data-testid="field-layout">
      {props.label && <label id="label-id">{props.label}</label>}
      <div aria-labelledby="label-id">{props.children}</div>
    </div>
  ),
}));

// 4. Portalの無効化
vi.mock('solid-js/web', async () => {
  const actual = await vi.importActual('solid-js/web');
  return {
    ...actual,
    Portal: (props: any) => <>{props.children}</>,
  };
});
