// src/ui/complex/EraDatePicker/inner-utils.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  generateDayOptions,
  generateMonthOptions,
  generateYearOptions,
  parseDateString,
  serializeDate,
} from './inner-utils';

describe('EraDatePicker inner-utils', () => {
  describe('generateYearOptions', () => {
    it('デフォルトで120年分の選択肢を生成すること', () => {
      const options = generateYearOptions();
      //console.log(options); // 最新年の選択肢を確認
      expect(options.length).toBe(120);
      // 最新年（実行時が2026年想定）のラベル確認
      expect(options[0].label).toContain('2026');
      expect(options[0].value).toBe('2026');
    });

    it('指定した件数の選択肢を生成すること', () => {
      const options = generateYearOptions(10);
      //console.log(options);
      expect(options.length).toBe(10);
    });
  });

  describe('generateMonthOptions', () => {
    it('1月から12月までの選択肢を生成すること', () => {
      const options = generateMonthOptions();
      //console.log(options);
      expect(options.length).toBe(12);
      expect(options[0]).toEqual({ label: '1月', value: '1' });
      expect(options[11]).toEqual({ label: '12月', value: '12' });
    });
  });

  describe('generateDayOptions', () => {
    it('通常の月（31日）の日数を正しく生成すること', () => {
      const options = generateDayOptions('2024', '1');
      //console.log(options);
      expect(options.length).toBe(31);
    });

    it('平年の2月（28日）の日数を正しく生成すること', () => {
      const options = generateDayOptions('2023', '2');
      //console.log(options);
      expect(options.length).toBe(28);
    });

    it('うるう年の2月（29日）の日数を正しく生成すること', () => {
      const options = generateDayOptions('2024', '2');
      //console.log(options);
      expect(options.length).toBe(29);
    });
  });

  describe('parseDateString', () => {
    it('有効な日付文字列を年・月・日に分解すること', () => {
      const result = parseDateString('1995-12-25');
      //console.log(result);
      expect(result).toEqual({
        year: '1995',
        month: '12',
        day: '25',
      });
    });

    it('1桁の月・日も正しくパースすること', () => {
      const result = parseDateString('2020-01-05');
      //console.log(result);
      expect(result).toEqual({
        year: '2020',
        month: '1',
        day: '5',
      });
    });

    it('不正な形式の文字列の場合は空文字のオブジェクトを返すこと', () => {
      const result = parseDateString('invalid-date');
      //console.log(result);
      expect(result).toEqual({ year: '', month: '', day: '' });
    });
  });

  describe('serializeDate', () => {
    it('年・月・日を YYYY-MM-DD 形式に結合すること', () => {
      const result = serializeDate('2024', '1', '1');
      //console.log(result);
      expect(result).toBe('2024-01-01');
    });

    it('いずれかの値が欠けている場合は空文字を返すこと', () => {
      //console.log(serializeDate('', '1', '1'));
      expect(serializeDate('', '1', '1')).toBe('');
      expect(serializeDate('2024', '', '1')).toBe('');
      expect(serializeDate('2024', '1', '')).toBe('');
    });

    it('存在しない日付（例: 2月30日）が渡された場合、その月の末日に補正すること', () => {
      // 2024年はうるう年なので29日に補正される
      const result = serializeDate('2024', '2', '30');
      //console.log(result);
      expect(result).toBe('2024-02-29');

      // 2023年は平年なので28日に補正される
      const result2 = serializeDate('2023', '2', '30');
      //console.log(result2);
      expect(result2).toBe('2023-02-28');

      // 4月31日は4月30日に補正される
      const result3 = serializeDate('2024', '4', '31');
      //console.log(result3);
      expect(result3).toBe('2024-04-30');
    });
  });
});
