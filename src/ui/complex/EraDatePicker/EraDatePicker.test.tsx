// src/ui/complex/EraDatePicker/EraDatePicker.test.tsx
import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';

import { EraDatePicker } from './EraDatePicker';

// FieldLayout が Ark UI のロジックを呼び出さないようにする
vi.mock('@ui/shared/FieldLayout', () => ({
  FieldLayout: (props: any) => (
    <div data-testid="mock-field-layout">
      <label>{props.label}</label>
      {props.children}
      <span>{props.helperText}</span>
    </div>
  ),
}));
// Portal をただの箱にする
vi.mock('solid-js/web', async () => {
  const actual = await vi.importActual('solid-js/web');
  return {
    ...actual,
    Portal: (props: any) => <>{props.children}</>, // Portal をただの箱にする
  };
});

// テスト用のモックPropsを作成するヘルパー
const createMockProps = (initialValue: string) => ({
  label: '生年月日',
  field: {
    state: {
      value: initialValue,
      meta: { errors: [] }, // errors を必ず空配列で持たせる
    },
    handleChange: vi.fn(),
    handleBlur: vi.fn(),
    name: 'birthday',
  } as any,
  helperText: '日付を選択してください',
});

describe('EraDatePicker', () => {
  it('初期値が正しくパースされ、各フィールドに表示されること', async () => {
    const props = createMockProps('1985-12-31');
    render(() => <EraDatePicker {...props} />);

    // 1. 年 (Select) の検証
    // getAllByText を使い、最初に見つかった表示用の要素を検証
    await waitFor(() => {
      const yearElements = screen.getAllByText(/1985 \(昭和60/);
      expect(yearElements[0]).toBeInTheDocument();
    });

    // 2. 月・日 (Combobox Input) の検証
    const monthInput = screen.getByPlaceholderText('月') as HTMLInputElement;
    const dayInput = screen.getByPlaceholderText('日') as HTMLInputElement;

    // SignalがDOMに反映されるまで待機
    await waitFor(() => {
      expect(monthInput.value).toBe('12月');
    });
    await waitFor(() => {
      expect(dayInput.value).toBe('31日');
    });
  });

  /*
  it('年を変更した際、親フォームへ正しい形式で通知されること', async () => {
    const props = createMockProps('2024-01-01');
    render(() => <EraDatePicker {...props} />);

    // 年のセレクトを操作（Ark UI の Select 操作をシミュレート）
    const yearTrigger = screen.getByRole('combobox', { name: /年/i });
    fireEvent.click(yearTrigger);

    const yearOption = screen.getByText('2020 (令和2)');
    fireEvent.click(yearOption);

    expect(props.field.handleChange).toHaveBeenCalledWith('2020-01-01');
  });

  it('月を変更した際、日の選択肢が動的に更新されること（2月のケース）', async () => {
    const props = createMockProps('2024-03-31'); // 2024年は閏年
    render(() => <EraDatePicker {...props} />);

    // 月を 2月に変更
    const monthInput = screen.getByPlaceholderText('月');
    fireEvent.focus(monthInput);
    fireEvent.input(monthInput, { target: { value: '2' } });

    const monthOption = screen.getByText('2月');
    fireEvent.click(monthOption);

    // 2月31日は存在しないため、date-fns の getDaysInMonth により 2024-02-29 に補正されて通知されることを確認
    await waitFor(() => {
      expect(props.field.handleChange).toHaveBeenCalledWith('2024-02-29');
    });
  });

  it('存在しない日付を入力しようとした場合、妥当な日付に補正されること', async () => {
    const props = createMockProps('2023-01-31'); // 2023年は平年
    render(() => <EraDatePicker {...props} />);

    // 月を 2月に変更
    const monthInput = screen.getByPlaceholderText('月');
    fireEvent.input(monthInput, { target: { value: '2' } });
    fireEvent.click(screen.getByText('2月'));

    // 2023年2月は28日まで。31日から28日へ補正されるはず
    await waitFor(() => {
      expect(props.field.handleChange).toHaveBeenCalledWith('2023-02-28');
    });
  });

  it('blurイベント時に field.handleBlur が呼ばれること', () => {
    const props = createMockProps('2024-01-01');
    render(() => <EraDatePicker {...props} />);

    const yearTrigger = screen.getByRole('combobox', { name: /年/i });
    fireEvent.blur(yearTrigger);

    expect(props.field.handleBlur).toHaveBeenCalled();
  });
  */
});
