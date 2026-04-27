// src/testing/test-utils.ts
import { fireEvent, screen } from '@solidjs/testing-library';

export const selectArkItem = async (
  labelName: string,
  itemText: string | RegExp,
) => {
  const trigger = screen.getByRole('combobox', { name: labelName });

  // 1. フォーカスとクリックでリストを開く
  fireEvent.focus(trigger);
  fireEvent.click(trigger);

  // 2. 選択したいテキストを持つ要素（ItemText）から親の Item を取得
  const textElement = await screen.findByText(itemText);
  const item = textElement.closest('[data-part="item"]') as HTMLElement;

  if (!item) throw new Error(`Item not found for text: ${itemText}`);

  // 3. Zag.jsの内部的な期待値：pointerDown -> pointerUp -> click を順番に
  // さらに、Zagが内部で管理している data-value を使って確実にトリガー
  fireEvent.pointerDown(item, { pointerId: 1, button: 0 });
  fireEvent.pointerUp(item, { pointerId: 1, button: 0 });
  fireEvent.click(item, { button: 0 });
};
