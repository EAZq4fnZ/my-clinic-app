// src/ui/form/EraDatePicker/inner-utils.ts
import { getDaysInMonth } from 'date-fns';

import { getJpEraYear } from '@utils/dateUtils';

export interface DateOption {
  label: string;
  value: string;
}

export const generateYearOptions = (count = 120): DateOption[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => {
    const y = currentYear - i;
    const era = getJpEraYear(y);
    return { label: `${y} (${era})年`, value: String(y) };
  });
};

export const generateMonthOptions = (): DateOption[] =>
  Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}月`,
    value: String(i + 1),
  }));

export const generateDayOptions = (
  yearStr: string,
  monthStr: string,
): DateOption[] => {
  const y = Number.parseInt(yearStr, 10) || new Date().getFullYear();
  const m = Number.parseInt(monthStr, 10) || 1;
  const days = getDaysInMonth(new Date(y, m - 1));
  return Array.from({ length: days }, (_, i) => ({
    label: `${i + 1}日`,
    value: String(i + 1),
  }));
};

export const parseDateString = (dateStr: string) => {
  if (!dateStr || !dateStr.includes('-'))
    return { year: '', month: '', day: '' };

  const parts = dateStr.split('-');

  // 1 -> "1", 01 -> "1" に正規化してSelectのvalueと一致させる
  const normalize = (val: string | undefined) => {
    if (!val) return '';
    return String(Number.parseInt(val, 10));
  };

  return {
    year: parts[0] || '',
    month: normalize(parts[1]),
    day: normalize(parts[2]),
  };
};

export const serializeDate = (
  year: string,
  month: string,
  day: string,
): string => {
  if (!year) return ''; // 年がない場合は日付として成立しないため空

  const formatNum = (val: string) => {
    if (!val) return '';
    return val.padStart(2, '0');
  };

  return `${year}-${formatNum(month)}-${formatNum(day)}`;
};
