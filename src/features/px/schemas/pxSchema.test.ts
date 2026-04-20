import { type } from 'arktype';
import { describe, expect, it } from 'vitest';
import { pxInsertSchema } from './pxSchema';

describe('pxSchema 網羅テスト', () => {
  // --- 正常系・正規化（Morph）のテスト ---
  describe('正常系と正規化の検証', () => {
    it('全角英数字・記号が期待通りに半角へ正規化されること', () => {
      const input = {
        last_name: '山田',
        first_name: '太郎',
        last_kana: 'ヤマダ',
        first_kana: 'タロウ',
        gender_code: 'male',
        birthday: '1990-01-01',
        tel: '０９０１２３４５６７８',
        zip: '１２３－４５６７',
        email: 'ＴＥＳＴ＠ＥＸＡＭＰＬＥ．ＣＯＭ',
        addr1: '東京都', // 必須
        addr2: '', // optional
        job: '', // optional
      };
      const out = pxInsertSchema(input);

      if (out instanceof type.errors) {
        throw new Error(`正常なデータでエラーが発生しました: ${out.summary}`);
      }

      // 正規化後の値を検証
      expect(out.tel).toBe('090-1234-5678');
      expect(out.zip).toBe('123-4567');
      expect(out.email).toBe('test@example.com'); // 小文字化まで含めた正規化
    });

    it('カナ入力がカタカナに統一されること', () => {
      const input = {
        last_kana: 'やまだ',
        first_kana: 'たろう',
        gender_code: 'female',
      };

      const out = pxInsertSchema.partial()(input);
      console.log('Validation output for kana normalization:', out);
      // エラーなら詳細を表示して失敗させる
      if (out instanceof type.errors) {
        throw new Error(`正規化に失敗しました: ${out.summary}`);
      }

      // ここで確実に変換後の値をチェック
      expect(out.last_kana).toBe('ヤマダ');
      expect(out.first_kana).toBe('タロウ');
    });
  });

  // --- 異常系・バリデーションエラーのテスト ---
  describe('バリデーションエラーの検証', () => {
    it('必須項目が欠けている、または空文字の場合にエラーを出すこと', () => {
      const input = {
        last_name: '', // 空文字
        first_name: '太郎',
        last_kana: '', // 空文字
        first_kana: '', // 空文字
        tel: '', // 空文字
        // gender_code が欠落
      };

      const out = pxInsertSchema(input);

      expect(out instanceof type.errors).toBe(true);
      if (out instanceof type.errors) {
        expect(out.summary).toContain('last_name'); // 空文字はエラー
        expect(out.summary).toContain('last_kana'); // 空文字はエラー
        expect(out.summary).toContain('first_kana'); // 空文字はエラー
        expect(out.summary).toContain('tel'); // 空文字はエラー
        expect(out.summary).toContain('gender_code'); // 欠落はエラー
      }
    });

    it('不正な形式の電話番号やメールアドレスを拒否すること', () => {
      const input = {
        tel: 'abc-defg-hijk', // 数字以外
        email: 'not-an-email', // メールの形式ではない
      };

      const out = pxInsertSchema.partial()(input);
      //console.log('Validation output for invalid tel and email:', out);
      expect(out instanceof type.errors).toBe(true);
      if (out instanceof type.errors) {
        //console.log('Validation errors:', out.summary);
        expect(out.summary).toContain('tel');
        expect(out.summary).toContain('email');
      }
    });

    it('性別コードが規定外の値であればエラーを出すこと', () => {
      const input = {
        gender_code: 'unknown_value',
      };

      const out = pxInsertSchema.partial()(input);
      expect(out instanceof type.errors).toBe(true);
    });
  });
});
