// @ui/complex/EraDatePicker.tsx
import { Combobox, Select, createListCollection } from '@ark-ui/solid';
import { format, getDaysInMonth, isValid, parse } from 'date-fns';
import { For, createEffect, createMemo, createSignal, onMount } from 'solid-js';
import { Portal } from 'solid-js/web';

import { getJpEraYear } from '@/utils/dateUtils';
import { FieldLayout, type FieldLayoutProps } from '@ui/shared/FieldLayout';

type EraDatePickerProps = Omit<FieldLayoutProps, 'children'>;

export const EraDatePicker = (props: EraDatePickerProps) => {
  // --- 1. 内部状態 (年・月・日の個別管理) ---
  const [year, setYear] = createSignal<string>('');
  const [month, setMonth] = createSignal<string>('');
  const [day, setDay] = createSignal<string>('');

  // 初期値 (yyyy-mm-dd) をパースしてシグナルにセット
  onMount(() => {
    const val = props.field.state.value;
    const d = parse(val, 'yyyy-MM-dd', new Date());
    if (isValid(d)) {
      setYear(format(d, 'yyyy'));
      setMonth(String(d.getMonth() + 1));
      setDay(String(d.getDate()));
    }
  });

  // --- 2. 選択肢の生成 (メモ化) ---

  // 年: yyyy (令和yy)
  const yearOptions = createMemo(() => {
    const current = new Date().getFullYear();
    const items = Array.from({ length: 110 }, (_, i) => {
      const y = current - i;
      return { label: `${y} (${getJpEraYear(y)})`, value: String(y) };
    });
    return createListCollection({ items });
  });

  // 月: 1-12
  const monthOptions = createMemo(() => {
    const items = Array.from({ length: 12 }, (_, i) => ({
      label: `${i + 1}月`,
      value: String(i + 1),
    }));
    return createListCollection({ items });
  });

  // 日: 年・月に応じて動的に変化
  const dayOptions = createMemo(() => {
    const y = Number.parseInt(year()) || 2000;
    const m = (Number.parseInt(month()) || 1) - 1;
    const daysCount = getDaysInMonth(new Date(y, m));

    const items = Array.from({ length: daysCount }, (_, i) => ({
      label: `${i + 1}日`,
      value: String(i + 1),
    }));
    return createListCollection({ items });
  });

  // --- 3. 親フォームへの通知 ---
  const notifyChange = () => {
    if (year() && month() && day()) {
      // 月・日を2桁にパディングして yyyy-mm-dd 形式に
      const y = year();
      const m = month().padStart(2, '0');
      const d = day().padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;

      // 正当な日付かチェックした上で通知
      if (isValid(parse(dateStr, 'yyyy-MM-dd', new Date()))) {
        props.field.handleChange(dateStr);
      }
    }
  };

  // 年・月・日が個別に変わった時に合成して通知
  createEffect(() => {
    notifyChange();
  });

  // --- 4. スタイル (既存コンポーネント踏襲) ---
  const selectTriggerClass =
    'h-10 border border-slate-300 rounded-md px-3 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none flex items-center justify-between w-full';
  const comboboxInputClass =
    'h-10 border border-slate-300 rounded-md px-3 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full';

  return (
    <FieldLayout
      label={props.label}
      field={props.field}
      helperText={props.helperText}
    >
      <div class="flex gap-2 items-start">
        {/* 年選択 (Select形式) */}
        <div class="flex-[2]">
          <Select.Root
            collection={yearOptions()}
            value={[year()]}
            onValueChange={(d) => setYear(d.value[0])}
            onExitComplete={props.field.handleBlur}
          >
            <Select.Control>
              <Select.Trigger class={selectTriggerClass}>
                <Select.ValueText placeholder="年" />
                <span class="text-xs text-slate-400">▼</span>
              </Select.Trigger>
            </Select.Control>
            <Portal>
              <Select.Positioner class="z-50">
                <Select.Content class="bg-white border border-slate-200 shadow-xl rounded-md p-1 max-h-60 overflow-y-auto">
                  <For each={yearOptions().items}>
                    {(item) => (
                      <Select.Item
                        item={item}
                        class="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer rounded"
                      >
                        <Select.ItemText>{item.label}</Select.ItemText>
                      </Select.Item>
                    )}
                  </For>
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </div>

        {/* 月選択 (Combobox形式) */}
        <div class="flex-1">
          <Combobox.Root
            collection={monthOptions()}
            value={[month()]}
            onValueChange={(d) => setMonth(d.value[0])}
            onExitComplete={props.field.handleBlur}
          >
            <Combobox.Control>
              <Combobox.Input class={comboboxInputClass} placeholder="月" />
            </Combobox.Control>
            <Portal>
              <Combobox.Positioner class="z-50">
                <Combobox.Content class="bg-white border border-slate-200 shadow-xl rounded-md p-1 max-h-60 overflow-y-auto">
                  <For each={monthOptions().items}>
                    {(item) => (
                      <Combobox.Item
                        item={item}
                        class="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer rounded"
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

        {/* 日選択 (Combobox形式) */}
        <div class="flex-1">
          <Combobox.Root
            collection={dayOptions()}
            value={[day()]}
            onValueChange={(d) => setDay(d.value[0])}
            onExitComplete={props.field.handleBlur}
          >
            <Combobox.Control>
              <Combobox.Input class={comboboxInputClass} placeholder="日" />
            </Combobox.Control>
            <Portal>
              <Combobox.Positioner class="z-50">
                <Combobox.Content class="bg-white border border-slate-200 shadow-xl rounded-md p-1 max-h-60 overflow-y-auto">
                  <For each={dayOptions().items}>
                    {(item) => (
                      <Combobox.Item
                        item={item}
                        class="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer rounded"
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
