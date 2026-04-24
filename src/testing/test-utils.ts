// src/testing/test-utils.ts
import { fireEvent, screen } from '@solidjs/testing-library';
import { vi } from 'vitest';

// --- Ark UI Helpers ---
export const selectArkItem = async (
  labelName: string,
  itemText: string | RegExp,
) => {
  const trigger = screen.getByRole('combobox', { name: labelName });
  fireEvent.focus(trigger);
  fireEvent.input(trigger, { target: { value: '' } });

  const option = await screen.findByText(itemText);
  fireEvent.pointerDown(option);
  fireEvent.pointerUp(option);
  fireEvent.click(option);
};

// --- Form Helpers ---
export const createMockField = (value: any) => ({
  state: { value, meta: { errors: [] } },
  handleChange: vi.fn(),
  handleBlur: vi.fn(),
  name: 'test-field',
});

/**
 * プロジェクト共通のFieldPropsモック
 * 特定のコンポーネント用ではなく、汎用的な型にする
 */
export const createTestFieldProps = (label: string, initialValue: any) => ({
  label,
  field: createMockField(initialValue) as any,
  helperText: 'test helper text',
});
