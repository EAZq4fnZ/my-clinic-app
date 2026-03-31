import { createSignal, createMemo, For, Show } from 'solid-js';
import { toJapaneseEra, EraSymbol } from '@utils/dateUtils';

interface EraDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
}

const EraDatePicker = (props: EraDatePickerProps) => {
  // 元号の選択肢
  const eraOptions: { label: string; value: EraSymbol }[] = [
    { label: '令和', value: 'R' },
    { label: '平成', value: 'H' },
    { label: '昭和', value: 'S' },
    { label: '大正', value: 'T' },
    { label: '明治', value: 'M' },
  ];

  // 現在の値から和暦情報を計算
  const eraInfo = createMemo(() => {
    if (!props.value) return null;
    return toJapaneseEra(props.value);
  });

  // 入力値が変更された時のハンドラ（西暦ベースで更新）
  const handleYearChange = (e: Event) => {
    const inputYear = (e.target as HTMLInputElement).value;
    const currentMonthDay = props.value.substring(4); // -MM-DD
    props.onChange(`${inputYear}${currentMonthDay}`);
  };

  const handleMonthDayChange = (e: Event) => {
    const inputDate = (e.target as HTMLInputElement).value;
    props.onChange(inputDate);
  };

  return (
    <div class="flex flex-col gap-1.5">
      <Show when={props.label}>
        <label class="text-sm font-medium text-gray-700">{props.label}</label>
      </Show>
      
      <div class="flex items-center gap-2">
        {/* 西暦入力（隠し、または主入力） */}
        <input
          type="date"
          value={props.value}
          onInput={handleMonthDayChange}
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
        />

        {/* 和暦表示バッジ（確認用） */}
        <Show when={eraInfo()}>
          <div class="shrink-0 px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-600 font-medium">
            {eraInfo()?.label}
          </div>
        </Show>
      </div>

      <Show when={props.error}>
        <span class="text-xs text-red-500">{props.error}</span>
      </Show>
    </div>
  );
};

export default EraDatePicker;