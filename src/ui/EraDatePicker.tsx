// @ui/complex/EraDatePicker.tsx
import { Combobox, Select, createListCollection } from '@ark-ui/solid';
import { format, getDaysInMonth, isValid, parseISO } from 'date-fns';
import { For, createMemo, createSignal, onMount, splitProps } from 'solid-js';

import { getJapaneseEraYear } from '@/utils/dateUtils';
import { FieldLayout, type FieldLayoutProps } from '@ui/shared/FieldLayout';

export const FormEraDatePickerField = (props: FieldLayoutProps) => {
  // 内部状態（YYYY-MM-DDをバラして管理）
  const [year, setYear] = createSignal<string>('');
  const [month, setMonth] = createSignal<string>('');
  const [day, setDay] = createSignal<string>('');

  // 1. 年のコレクション: yyyy (和暦n年) 形式
  const yearCollection = createMemo(() => {
    const currentYear = new Date().getFullYear();
    const items = Array.from({ length: 110 }, (_, i) => {
      const y = currentYear - i;
      // dateUtils.ts の getJapaneseEraYear を使用
      const eraLabel = getJapaneseEraYear(y);
      return { label: `${y} (${eraLabel})`, value: String(y) };
    });
    return createListCollection({ items });
  });

  // 2. 月のコレクション
  const monthCollection = createListCollection({
    items: Array.from({ length: 12 }, (_, i) => ({
      label: `${i + 1}月`,
      value: String(i + 1).padStart(2, '0'),
    })),
  });

  // 3. 日のコレクション: 年と月に連動して最大日数を変更
  const dayCollection = createMemo(() => {
    const y = Number.parseInt(year()) || 2000;
    const m = Number.parseInt(month()) || 1;
    // date-fns を使用してその月の末日を取得
    const maxDays = getDaysInMonth(new Date(y, m - 1));

    return createListCollection({
      items: Array.from({ length: maxDays }, (_, i) => ({
        label: `${i + 1}日`,
        value: String(i + 1).padStart(2, '0'),
      })),
    });
  });

  // 全て入力されたら TanStack Form に通知
  const notifyChange = () => {
    if (year() && month() && day()) {
      const isoString = `${year()}-${month()}-${day()}`;
      if (isValid(parseISO(isoString))) {
        props.field.handleChange(isoString);
      }
    }
  };

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
        {/* 年: Select (和暦併記) */}
        <Select.Root
          collection={yearCollection()}
          value={[year()]}
          onValueChange={(d) => {
            setYear(d.value[0]);
            notifyChange();
          }}
        >
          <Select.Control>
            <Select.Trigger class="border border-slate-300 px-3 py-2 rounded-md min-w-[160px] bg-white flex justify-between items-center text-sm">
              <Select.ValueText placeholder="年(和暦)" />
            </Select.Trigger>
          </Select.Control>
          <Select.Positioner>
            <Select.Content class="bg-white border shadow-xl rounded-md z-50 max-h-60 overflow-y-auto p-1">
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
        </Select.Root>

        {/* 月: Combobox */}
        <Combobox.Root
          collection={monthCollection}
          value={[month()]}
          onValueChange={(d) => {
            setMonth(d.value[0]);
            notifyChange();
          }}
        >
          <Combobox.Control>
            <Combobox.Input
              class="border border-slate-300 px-2 py-2 rounded-md w-16 text-center text-sm"
              placeholder="月"
            />
          </Combobox.Control>
        </Combobox.Root>

        {/* 日: Combobox (年月に応じて動的変化) */}
        <Combobox.Root
          collection={dayCollection()}
          value={[day()]}
          onValueChange={(d) => {
            setDay(d.value[0]);
            notifyChange();
          }}
        >
          <Combobox.Control>
            <Combobox.Input
              class="border border-slate-300 px-2 py-2 rounded-md w-16 text-center text-sm"
              placeholder="日"
            />
          </Combobox.Control>
        </Combobox.Root>
      </div>
    </FieldLayout>
  );
};
