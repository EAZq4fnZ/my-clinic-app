// @ui/complex/EraDatePicker.tsx
import { Combobox, Select, createListCollection } from '@ark-ui/solid';
import { getDaysInMonth, isValid, parseISO } from 'date-fns';
import { For, createMemo, createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { getJpEraYear } from '@/utils/dateUtils';
import { FieldLayout, type FieldLayoutProps } from '@ui/shared/FieldLayout';

// フォーム用の和暦対応日付ピッカーコンポーネント
type FormEraDatePickerFieldProps = Omit<FieldLayoutProps, 'children'>;

//  和暦対応日付ピッカーコンポーネント: 年はセレクト、月と日はコンボボックスで選択
export const FormEraDatePickerField = (props: FormEraDatePickerFieldProps) => {
  const [year, setYear] = createSignal<string>('');
  const [month, setMonth] = createSignal<string>('');
  const [day, setDay] = createSignal<string>('');

  // 1. 年のコレクション: 計算プロセスを明示
  const yearCollection = createMemo(() => {
    const currentYear = new Date().getFullYear();
    const items = Array.from({ length: 110 }, (_, i) => {
      const y = currentYear - i;
      const eraLabel = getJpEraYear(y);
      // 例: "2024 (令和6)" のようなラベルを生成
      return { label: `${y} (${eraLabel})`, value: String(y) };
    });
    return createListCollection({ items });
  });

  // 2. 月のコレクション: 他と記述を統一（return を明示）
  const monthCollection = createMemo(() => {
    const items = Array.from({ length: 12 }, (_, i) => ({
      label: `${i + 1}月`,
      value: String(i + 1).padStart(2, '0'), // 1月を "01" のようにゼロパディングして表現
    }));
    return createListCollection({ items });
  });

  // 3. 日のコレクション: 年と月に依存して動的に生成
  const dayCollection = createMemo(() => {
    const y = Number.parseInt(year()) || 2000;
    const m = Number.parseInt(month()) || 1;
    const maxDays = getDaysInMonth(new Date(y, m - 1));
    const items = Array.from({ length: maxDays }, (_, i) => ({
      label: `${i + 1}日`,
      value: String(i + 1).padStart(2, '0'), // 1日を "01" のようにゼロパディングして表現
    }));
    return createListCollection({ items });
  });
  // 4. 年月日が全て選択されたときに親コンポーネントに変更を通知する関数
  const notifyChange = () => {
    if (year() && month() && day()) {
      const isoString = `${year()}-${month()}-${day()}`;
      if (isValid(parseISO(isoString))) {
        props.field.handleChange(isoString);
      }
    }
  };
  // 5. フォーカスアウト時の処理: フォーカスが完全に外れたときにのみ handleBlur を呼び出す
  return (
    <FieldLayout
      label={props.label}
      field={props.field}
      helperText={props.helperText}
    >
      <div
        class="flex gap-2 items-center"
        onFocusOut={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            props.field.handleBlur();
          }
        }}
      >
        {/* 6.年選択 (Select) */}
        <Select.Root
          collection={yearCollection()}
          value={[year()]}
          onValueChange={(d) => {
            setYear(d.value[0]);
            notifyChange();
          }}
        >
          {' '}
          {/* セレクトのトリガーとコンテンツの構造を明確に分ける */}
          <Select.Control>
            <Select.Trigger class="border border-slate-300 px-3 py-2 rounded-md min-w-[160px] bg-white flex justify-between items-center text-sm">
              <Select.ValueText placeholder="年(和暦)" />
              <span class="text-xs text-slate-400">▼</span>
            </Select.Trigger>
          </Select.Control>
          <Portal>
            <Select.Positioner class="z-50">
              <Select.Content class="bg-white border border-slate-200 shadow-xl rounded-md p-1 max-h-64 overflow-y-auto">
                <For each={yearCollection().items}>
                  {(item) => (
                    <Select.Item
                      item={item}
                      class="px-2 py-1.5 text-sm hover:bg-blue-50 cursor-pointer rounded"
                    >
                      <Select.ItemText>{item.label}</Select.ItemText>
                    </Select.Item>
                  )}
                </For>
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>

        {/* 7. 月入力 (Combobox) */}
        <Combobox.Root
          collection={monthCollection()}
          value={[month()]}
          onValueChange={(d) => {
            setMonth(d.value[0]);
            notifyChange();
          }}
        >
          {' '}
          {/* コンボボックスのトリガーとコンテンツの構造を明確に分ける */}
          <Combobox.Control class="relative">
            <Combobox.Input
              class="border border-slate-300 px-2 py-2 rounded-md w-16 text-center text-sm"
              placeholder="月"
            />
          </Combobox.Control>
          <Portal>
            <Combobox.Positioner class="z-50">
              <Combobox.Content class="bg-white border border-slate-200 shadow-xl rounded-md p-1">
                <For each={monthCollection().items}>
                  {(item) => (
                    <Combobox.Item
                      item={item}
                      class="px-2 py-1 text-sm hover:bg-blue-50 cursor-pointer rounded"
                    >
                      <Combobox.ItemText>{item.label}</Combobox.ItemText>
                    </Combobox.Item>
                  )}
                </For>
              </Combobox.Content>
            </Combobox.Positioner>
          </Portal>
        </Combobox.Root>

        {/* 8. 日入力 (Combobox) */}
        <Combobox.Root
          collection={dayCollection()}
          value={[day()]}
          onValueChange={(d) => {
            setDay(d.value[0]);
            notifyChange();
          }}
        >
          {/* コンボボックスのトリガーとコンテンツの構造を明確に分ける */}
          <Combobox.Control class="relative">
            <Combobox.Input
              class="border border-slate-300 px-2 py-2 rounded-md w-16 text-center text-sm"
              placeholder="日"
            />
          </Combobox.Control>
          <Portal>
            <Combobox.Positioner class="z-50">
              <Combobox.Content class="bg-white border border-slate-200 shadow-xl rounded-md p-1">
                <For each={dayCollection().items}>
                  {(item) => (
                    <Combobox.Item
                      item={item}
                      class="px-2 py-1 text-sm hover:bg-blue-50 cursor-pointer rounded"
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
    </FieldLayout>
  );
};
