// src/utils/dateUtils.ts

// 1. 型定義
export type AlertStatus = 'normal' | 'warning' | 'critical';

export type EraSymbol = 'R' | 'H' | 'S' | 'T' | 'M';

interface Era {
  symbol: EraSymbol;
  name: string;
  start: Date;
}

// 2. 元号定義マスタ
const ERAS: Era[] = [
  { symbol: 'R', name: '令和', start: new Date('2019-05-01') },
  { symbol: 'H', name: '平成', start: new Date('1989-01-08') },
  { symbol: 'S', name: '昭和', start: new Date('1926-12-25') },
  { symbol: 'T', name: '大正', start: new Date('1912-07-30') },
  { symbol: 'M', name: '明治', start: new Date('1868-01-25') },
];

/**
 * アラート状態の判定 (例: 最終受診日から1ヶ月以上空いたら warning)
 */
export const getAlertStatus = (lastDate: string | null): AlertStatus => {
  if (!lastDate) return 'normal';

  const last = new Date(lastDate);
  const now = new Date();
  
  // 30日以上経過していたら warning にする例
  const diffDays = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
  
  if (diffDays > 60) return 'critical';
  if (diffDays > 30) return 'warning';
  
  return 'normal'; // ★ 最後に必ず return を置くことでエラーが解消されます
};

/**
 * 西暦(YYYY-MM-DD)を和暦オブジェクトに変換
 */
export const toJapaneseEra = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;

  const era = ERAS.find(e => date >= e.start);
  if (!era) return { eraName: '西暦', year: date.getFullYear() };

  const eraYear = date.getFullYear() - era.start.getFullYear() + 1;
  return {
    eraSymbol: era.symbol,
    eraName: era.name,
    year: eraYear,
    label: `${era.name}${eraYear === 1 ? '元' : eraYear}年`
  };
};

/**
 * 生年月日から現在の年齢を計算
 */
export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};