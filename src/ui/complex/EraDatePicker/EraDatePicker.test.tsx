// src/ui/complex/EraDatePicker/EraDatePicker.test.tsx
import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';

import { EraDatePicker } from './EraDatePicker';

vi.mock('@ui/shared/FieldLayout', () => ({
  FieldLayout: (props: any) => (
    <div data-testid="mock-field-layout">
      <label>{props.label}</label>
      {props.children}
      <span>{props.helperText}</span>
    </div>
  ),
}));

vi.mock('solid-js/web', async () => {
  const actual = await vi.importActual('solid-js/web');
  return {
    ...actual,
    Portal: (props: any) => <>{props.children}</>,
  };
});

const createMockProps = (initialValue: string) => ({
  label: '生年月日',
  field: {
    state: {
      value: initialValue,
      meta: { errors: [] },
    },
    handleChange: vi.fn(),
    handleBlur: vi.fn(),
    name: 'birthday',
  } as any,
  helperText: '和暦で入力してください',
});

describe('EraDatePicker', () => {
  it('初期値が正しくパースされ、各フィールドに表示されること', () => {
    render(() => <EraDatePicker {...createMockProps('2024-05-10')} />);

    // inner-utils.ts のラベル形式に合わせてアサーション
    expect(screen.getByPlaceholderText('年 (西暦)')).toHaveValue(
      '2024 (令和6)年',
    );
    expect(screen.getByPlaceholderText('月')).toHaveValue('5月');
    expect(screen.getByPlaceholderText('日')).toHaveValue('10日');
  });

  it('年を変更した際、親フォームへ正しい形式で通知されること', async () => {
    const props = createMockProps('2024-01-01');
    render(() => <EraDatePicker {...props} />);

    const yearInput = screen.getByRole('combobox', { name: '年' });
    fireEvent.focus(yearInput);
    fireEvent.input(yearInput, { target: { value: '' } });

    const yearOption = await screen.findByText(/2020/);
    fireEvent.click(yearOption);

    await waitFor(() => {
      expect(props.field.handleChange).toHaveBeenCalledWith('2020-01-01');
    });
  });

  it('月を変更した際、日の選択肢が動的に更新されること（2月のケース）', async () => {
    const props = createMockProps('2024-03-31'); // 2024年は閏年
    render(() => <EraDatePicker {...props} />);

    const monthInput = screen.getByRole('combobox', { name: '月' });
    fireEvent.focus(monthInput);
    fireEvent.input(monthInput, { target: { value: '' } });

    const monthOption = await screen.findByText(/2月/);
    fireEvent.click(monthOption);

    // 3月31日 -> 2月29日への補正を検証
    await waitFor(() => {
      expect(props.field.handleChange).toHaveBeenCalledWith('2024-02-29');
    });
  });

  it('存在しない日付を入力しようとした場合、妥当な日付に補正されること', async () => {
    const props = createMockProps('2023-01-31'); // 2023年は平年
    render(() => <EraDatePicker {...props} />);

    const monthInput = screen.getByRole('combobox', { name: '月' });
    fireEvent.focus(monthInput);
    fireEvent.input(monthInput, { target: { value: '' } });

    const monthOption = await screen.findByText(/2月/);
    fireEvent.click(monthOption);

    // 平年なので 2月28日
    await waitFor(() => {
      expect(props.field.handleChange).toHaveBeenCalledWith('2023-02-28');
    });
  });

  it('blurイベント時に field.handleBlur が呼ばれること', async () => {
    const props = createMockProps('2024-01-01');
    render(() => <EraDatePicker {...props} />);

    const yearInput = screen.getByPlaceholderText('年 (西暦)');
    fireEvent.blur(yearInput);

    await waitFor(() => {
      expect(props.field.handleBlur).toHaveBeenCalled();
    });
  });
});
