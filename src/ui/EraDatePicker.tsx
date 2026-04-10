import { getJapaneseEraYear } from '@/utils/dateUtils';
import { getDaysInMonth } from 'date-fns';
import { type Component, For, createMemo } from 'solid-js';

interface Props {
  value: string | null; // "YYYY-MM-DD" 形式
  onSelect: (date: string) => void;
  label?: string;
  startYear?: number; // 選択可能な開始年
  endYear?: number; // 選択可能な終了年
}

export const EraDatePicker: Component<Props> = (props) => {
  // 現在の値を年・月・日に分解して取得
  const dateParts = () => {
    const d = props.value ? new Date(props.value) : new Date();
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    };
  };

  // 年の選択肢を生成 (デフォルトは1930年から今年まで)
  const yearOptions = createMemo(() => {
    const end = props.endYear || new Date().getFullYear();
    const start = props.startYear || 1930;
    return Array.from({ length: end - start + 1 }, (_, i) => end - i);
  });

  // 選択中の年月において、最大何日まであるかを動的に計算
  const maxDays = createMemo(() => {
    return getDaysInMonth(new Date(dateParts().year, dateParts().month - 1));
  });

  // ドロップダウン変更時の統合処理
  const handleChange = (type: 'y' | 'm' | 'd', val: string) => {
    const { year, month, day } = dateParts();
    let newY = year,
      newM = month,
      newD = day;

    if (type === 'y') newY = Number.parseInt(val);
    if (type === 'm') newM = Number.parseInt(val);
    if (type === 'd') newD = Number.parseInt(val);

    // 月を切り替えた際に、日がその月の最大日数を超えていないかチェック
    const currentMax = getDaysInMonth(new Date(newY, newM - 1));
    if (newD > currentMax) newD = currentMax;

    // YYYY-MM-DD形式で親コンポーネントに通知
    const formatted = `${newY}-${String(newM).padStart(2, '0')}-${String(
      newD,
    ).padStart(2, '0')}`;
    props.onSelect(formatted);
  };

  return (
    <div class="flex flex-col gap-1">
      {props.label && (
        <label class="text-sm font-medium text-gray-700">{props.label}</label>
      )}

      <div class="flex items-center gap-2">
        {/* 年選択：西暦(和暦)形式 */}
        <select
          value={dateParts().year}
          onChange={(e) => handleChange('y', e.currentTarget.value)}
          class="border rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <For each={yearOptions()}>
            {(y) => (
              <option value={y}>
                {y} ({getJapaneseEraYear(y)})
              </option>
            )}
          </For>
        </select>
        <span class="text-sm text-gray-600">年</span>

        {/* 月選択 */}
        <select
          value={dateParts().month}
          onChange={(e) => handleChange('m', e.currentTarget.value)}
          class="border rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <For each={Array.from({ length: 12 }, (_, i) => i + 1)}>
            {(m) => <option value={m}>{m}</option>}
          </For>
        </select>
        <span class="text-sm text-gray-600">月</span>

        {/* 日選択：月によって日数を自動変更 */}
        <select
          value={dateParts().day}
          onChange={(e) => handleChange('d', e.currentTarget.value)}
          class="border rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <For each={Array.from({ length: maxDays() }, (_, i) => i + 1)}>
            {(d) => <option value={d}>{d}</option>}
          </For>
        </select>
        <span class="text-sm text-gray-600">日</span>
      </div>
    </div>
  );
};
