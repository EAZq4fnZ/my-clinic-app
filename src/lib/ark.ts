// src/lib/ark.ts
import { type } from 'arktype';

export const ark = {
  // 必須：正規化して1文字以上
  required: type('string.normalize.NFKC').and('string>=1'),

  // 任意：空文字を許容 (正規化して0文字以上)
  optional: type("'' | string").pipe((s) =>
    s === '' ? '' : s.normalize('NFKC'),
  ),

  // 全角カナ (例: カタカナ、スペース、長音)
  kana: type('string.normalize.NFKC').and('/^[ァ-ヶー・\\s]+$/'),

  // 郵便番号 (例: 123-4567)
  zip: type('string.normalize.NFKC').and('/^\\d{3}-\\d{4}$/'),

  // メール：正規化してメールフォーマット
  email: type('string.normalize.NFKC').and('string.email'),

  // 日付：必須
  date: type('string.date'),
};
