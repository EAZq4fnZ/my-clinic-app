import { add, isAfter } from 'date-fns';

/**
 * 西暦を和暦（略称：令和06/01/01形式）に変換する
 */
export const formatToJapaneseEra = (date: Date | string | null): string => {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
    era: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
};

/**
 * 西暦から和暦の「年」の部分だけを抽出する (例: 2024 -> 令和6)
 */
export const getJapaneseEraYear = (year: number): string => {
  const d = new Date(year, 0, 1);
  return new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
    era: 'short',
    year: 'numeric',
  }).format(d);
};

/**
 * 警告ステータスの取得
 * - 1ヶ月以上経過: critical
 * - 3週間(21日)以上経過: warn
 * - それ以外: normal
 */
export type AlertStatus = 'normal' | 'warn' | 'critical';

export const getAlertStatus = (
  targetDate: Date | string | null,
): AlertStatus => {
  if (!targetDate) return 'normal';
  const start: Date =
    typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const today = new Date();

  // 今日 日付がstartより１か月超えていれば、警告ステータス[critical]を返す
  if (isAfter(today, add(start, { months: 1 }))) return 'critical';

  // 今日 日付がstartより３週間超えていれば、警告ステータス[warn]を返す
  if (isAfter(today, add(start, { weeks: 3 }))) return 'warn';

  // それ以外（３週間以内）のため [normal]を返す
  return 'normal';
};
