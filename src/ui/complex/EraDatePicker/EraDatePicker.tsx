// src/ui/complex/EraDatePicker/EraDatePicker.tsx
import { Combobox, createListCollection } from '@ark-ui/solid';
import { For, createMemo, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import { FieldLayout, type FieldLayoutProps } from '@ui/shared/FieldLayout';
import {
  type DateOption,
  generateDayOptions,
  generateMonthOptions,
  generateYearOptions,
  parseDateString,
} from './inner-utils';
// EraDatePicker の Props 定義 (FieldLayoutProps から children を除いたもの)
type EraDatePickerProps = Omit<FieldLayoutProps, 'children'>;
// EraDatePicker コンポーネントの実装
export const EraDatePicker = (props: EraDatePickerProps) => {
  // レイアウト用のプロパティ(local)と、Comboboxコンポーネントにそのまま渡すプロパティ(rest)に分ける
  const [local, rest] = splitProps(props, ['label', 'field', 'helperText']);

  // TanStack Form の値 (YYYY-MM-DD) をパース
  const dateParts = createMemo(() => parseDateString(local.field.state.value));

  // 各選択肢の生成
  const yearOptions = createMemo(() => generateYearOptions());
  const monthOptions = createMemo(() => generateMonthOptions());
  const dayOptions = createMemo(() =>
    generateDayOptions(dateParts().year, dateParts().month),
  );

  // コレクションの定義 (Ark UI の内部型に合わせて itemToString と itemToValue を定義)
  const yearCollection = createMemo(() =>
    createListCollection<DateOption>({
      items: yearOptions(),
      itemToString: (item) => item.label,
      itemToValue: (item) => String(item.value),
    }),
  );
  // 月と日も同様にコレクションを定義
  const monthCollection = createMemo(() =>
    createListCollection<DateOption>({
      items: monthOptions(),
      itemToString: (item) => item.label,
      itemToValue: (item) => String(item.value),
    }),
  );
  // 日は月によって変わるため、dateParts の値に依存して生成される
  const dayCollection = createMemo(() =>
    createListCollection<DateOption>({
      items: dayOptions(),
      itemToString: (item) => item.label,
      itemToValue: (item) => String(item.value),
    }),
  );

  // 値の更新処理
  const handlePartChange = (
    part: 'year' | 'month' | 'day',
    newValue: string,
  ) => {
    const current = { ...dateParts(), [part]: newValue };

    // 全ての値が揃ったとき、または全て空のときに handleChange を呼ぶ
    if (current.year && current.month && current.day) {
      const formattedMonth = current.month.padStart(2, '0');
      const formattedDay = current.day.padStart(2, '0');
      local.field.handleChange(
        `${current.year}-${formattedMonth}-${formattedDay}`,
      );
    } else if (!current.year && !current.month && !current.day) {
      local.field.handleChange('');
    }
  };
  // 入力フィールドの基本クラス（年は少し幅を広く、月と日は同じ幅に）を定義
  const inputBaseClass =
    'h-10 w-full border border-slate-300 rounded-md px-3 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50';

  return (
    // FieldLayout に label, field, helperText を渡す
    <FieldLayout
      label={local.label}
      field={local.field}
      helperText={local.helperText}
    >
      {/* 3つの Combobox を横並びに配置するための flex コンテナ */}
      <div class="flex gap-2 items-start">
        {/* 年選択 */}
        <div class="flex-[2]">
          <Combobox.Root
            collection={yearCollection()}
            value={dateParts().year ? [dateParts().year] : []}
            onValueChange={(d) => handlePartChange('year', d.value[0])}
            onExitComplete={() => local.field.handleBlur()}
          >
            <Combobox.Control>
              <Combobox.Input class={inputBaseClass} placeholder="年 (西暦)" />
            </Combobox.Control>
            <Portal>
              <Combobox.Positioner class="z-[100]">
                <Combobox.Content class="bg-white border border-slate-200 shadow-xl rounded-md p-1 max-h-60 overflow-y-auto">
                  <For each={yearCollection().items}>
                    {(item) => (
                      <Combobox.Item
                        item={item}
                        class="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer rounded outline-none data-[highlighted]:bg-blue-50"
                      >
                        <Combobox.ItemText>{item.label}</Combobox.ItemText>
                      </Combobox.Item>
                    )}
                  </For>
                </Combobox.Content>
              </Combobox.Positioner>
            </Portal>
          </Combobox.Root>
        </div>

        {/* 月選択 */}
        <div class="flex-1">
          <Combobox.Root
            collection={monthCollection()}
            value={dateParts().month ? [dateParts().month] : []}
            onValueChange={(d) => handlePartChange('month', d.value[0])}
            onExitComplete={() => local.field.handleBlur()}
          >
            <Combobox.Control>
              <Combobox.Input class={inputBaseClass} placeholder="月" />
            </Combobox.Control>
            <Portal>
              <Combobox.Positioner class="z-[100]">
                <Combobox.Content class="bg-white border border-slate-200 shadow-xl rounded-md p-1 max-h-60 overflow-y-auto">
                  <For each={monthCollection().items}>
                    {(item) => (
                      <Combobox.Item
                        item={item}
                        class="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer rounded outline-none data-[highlighted]:bg-blue-50"
                      >
                        <Combobox.ItemText>{item.label}</Combobox.ItemText>
                      </Combobox.Item>
                    )}
                  </For>
                </Combobox.Content>
              </Combobox.Positioner>
            </Portal>
          </Combobox.Root>
        </div>

        {/* 日選択 */}
        <div class="flex-1">
          <Combobox.Root
            collection={dayCollection()}
            value={dateParts().day ? [dateParts().day] : []}
            onValueChange={(d) => handlePartChange('day', d.value[0])}
            onExitComplete={() => local.field.handleBlur()}
          >
            <Combobox.Control>
              <Combobox.Input class={inputBaseClass} placeholder="日" />
            </Combobox.Control>
            <Portal>
              <Combobox.Positioner class="z-[100]">
                <Combobox.Content class="bg-white border border-slate-200 shadow-xl rounded-md p-1 max-h-60 overflow-y-auto">
                  <For each={dayCollection().items}>
                    {(item) => (
                      <Combobox.Item
                        item={item}
                        class="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer rounded outline-none data-[highlighted]:bg-blue-50"
                      >
                        <Combobox.ItemText>{item.label}</Combobox.ItemText>
                      </Combobox.Item>
                    )}
                  </For>
                </Combobox.Content>
              </Combobox.Positioner>
            </Portal>
          </Combobox.Root>
        </div>
      </div>
    </FieldLayout>
  );
};
