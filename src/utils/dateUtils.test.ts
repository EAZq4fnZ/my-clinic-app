// src/utils/dateUtils.test.ts
import { describe, expect, it } from 'vitest';
import { formatToJpEra, getJpEraYear } from './dateUtils';

describe('dateUtils', () => {
  describe('formatToJpEra', () => {
    it('有効な日付を和暦形式（略称）に変換すること', () => {
      // 令和のケース
      expect(formatToJpEra(new Date(2024, 0, 1))).toBe('令和6/01/01');
      // 平成のケース
      expect(formatToJpEra('2000-05-10')).toBe('平成12/05/10');
      // 昭和のケース
      expect(formatToJpEra('1980-12-31')).toBe('昭和55/12/31');
    });

    it('元号の変わり目（令和元年）を正しく処理すること', () => {
      // 2019年5月1日以降が令和
      expect(formatToJpEra('2019-05-01')).toBe('令和1/05/01');
      // 2019年4月30日までは平成
      expect(formatToJpEra('2019-04-30')).toBe('平成31/04/30');
    });

    it('null や空文字が渡された場合はハイフンを返すこと', () => {
      expect(formatToJpEra(null)).toBe('-');
      expect(formatToJpEra('')).toBe('-');
    });
  });

  describe('getJpEraYear', () => {
    it('西暦から「元号+年」を抽出すること', () => {
      expect(getJpEraYear(2024)).toBe('令和6');
      expect(getJpEraYear(2000)).toBe('平成12');
      expect(getJpEraYear(1980)).toBe('昭和55');
    });

    it('「元年」の表記を正しく取得すること', () => {
      // Intl.DateTimeFormat の設定により「令和1」か「令和元年」か分かれるが、
      // 多くのモダンブラウザ環境（ja-JP）では「1」または「元年」が返る。
      // 実装の replace(/年$/, '') が意図通り動くか確認。
      const reiwa1 = getJpEraYear(2019);
      expect(reiwa1).toMatch(/令和(1|元)/);
    });

    it('明治・大正などの古い年号も処理できること', () => {
      expect(getJpEraYear(1920)).toBe('大正9');
      expect(getJpEraYear(1900)).toBe('明治33');
    });
  });
});
