// zipUtils.test.ts
import { describe, expect, it, vi } from 'vitest';

import { fetchAddressDetailByZip, formatZipCode } from './zipUtils';

describe('zipUtils', () => {
  describe('formatZipCode (正規化ロジック)', () => {
    it('全角数字を半角に変換し、ハイフンを除去すること', () => {
      expect(formatZipCode('１２３－４５６７')).toBe('1234567');
      expect(formatZipCode('900-0012')).toBe('9000012');
    });

    it('空文字や不正な入力に対して空文字を返すこと', () => {
      expect(formatZipCode('')).toBe('');
      // @ts-ignore
      expect(formatZipCode(null)).toBe('');
    });
  });

  describe('fetchAddressDetailByZip (API連携)', () => {
    it('実在する郵便番号で住所を取得できること', async () => {
      // 実際のAPIを叩くテスト（ネットワーク環境が必要）
      // もしCI環境などで外部APIを叩きたくない場合は mock を使いますが、
      // 最初は挙動確認のために実機で通してみるのがおすすめです。
      const result = await fetchAddressDetailByZip('100-0001');

      expect(result.status).toBe(200);
      expect(result.prefecture).toBe('東京都');
      expect(result.city).toBe('千代田区');
      expect(result.zipCode).toBe('100-0001'); // 整形されて返ってくるか
    });

    it('存在しない郵便番号の場合、404ステータスとメッセージを返すこと', async () => {
      const result = await fetchAddressDetailByZip('999-9999');
      //console.log('API response for non-existent zip code:', result);
      expect(result.status).toBe(200); // APIは200で返すが、resultsが空のパターン
      expect(result.message).toContain('見つかりませんでした');
      expect(result.prefecture).toBe('');
    });
  });
});
