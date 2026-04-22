// src/ui/complex/EraDatePicker/inner-utils.ts

import { format, getDaysInMonth, isValid, parse } from 'date-fns';

import { getJpEraYear } from '@utils/dateUtils';

// DateOption 型の定義 (label と value を持つオブジェクト)
export interface DateOption {
  label: string;
  value: string;
}

/**
 * 年の選択肢を生成 (例: "2024 (令和6年)")
 * getJpEraYearが「令和6」を返すため、こちらで「年」を補完します
 */
export const generateYearOptions = (count = 120): DateOption[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => {
    const y = currentYear - i;
    const era = getJpEraYear(y); // 「令和6」が返る
    return {
      label: `${y} (${era})年`, // 表示は「2024 (令和6)年」
      value: String(y),
    };
  });
};
// 月の選択肢を生成 (例: "1月", "2月", ..., "12月")
export const generateMonthOptions = (): DateOption[] =>
  Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}月`,
    value: String(i + 1),
  }));
// 日の選択肢を生成 (例: "1日", "2日", ..., "31日")。月によって日数が変わるため、年と月を引数に取る
export const generateDayOptions = (
  yearStr: string,
  monthStr: string,
): DateOption[] => {
  const y = Number(yearStr) || new Date().getFullYear();
  const m = Number(monthStr) || 1;
  const days = getDaysInMonth(new Date(y, m - 1));

  return Array.from({ length: days }, (_, i) => ({
    label: `${i + 1}日`,
    value: String(i + 1),
  }));
};
// TanStack Form から渡される日付文字列 (YYYY-MM-DD) をパースして年、月、日に分解する関数
export const parseDateString = (dateStr: string) => {
  const d = parse(dateStr, 'yyyy-MM-dd', new Date());
  if (!isValid(d)) return { year: '', month: '', day: '' };
  // 年、月、日をそれぞれ文字列として返す
  return {
    year: format(d, 'yyyy'),
    month: String(d.getMonth() + 1),
    day: String(d.getDate()),
  };
};
// 年、月、日を受け取って YYYY-MM-DD 形式の文字列にシリアライズする関数
export const serializeDate = (
  year: string,
  month: string,
  day: string,
): string => {
  if (!year || !month || !day) return ''; // いずれかが空の場合は空文字を返す
  // 月と日を2桁に揃える (例: "1" → "01")。これも日付の妥当性を保つために必要
  const m = month.padStart(2, '0');
  const d = day.padStart(2, '0');
  const dateStr = `${year}-${m}-${d}`;
  // パースして妥当な日付か確認。例えば「2024-02-30」のような存在しない日付が入力された場合、date-fns は自動的に「2024-03-01」と解釈してしまうため、元の文字列とフォーマット後の文字列を比較して不正な日付を弾く
  const parsedDate = parse(dateStr, 'yyyy-MM-dd', new Date());
  if (isValid(parsedDate)) return dateStr;
  // 不正な日付の場合は、月の末日を使用して補正する。例えば「2024-02-30」が入力された場合、「2024-02-29」に補正する
  const lastDay = getDaysInMonth(new Date(Number(year), Number(month) - 1));
  return `${year}-${m}-${String(lastDay).padStart(2, '0')}`;
};
