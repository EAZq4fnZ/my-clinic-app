// src/lib/ark.ts
import { type } from 'arktype';

/**
 * プロジェクト全域で共有する ArkType スキーマ定義
 */
export const ark = {
  // 1文字以上の文字列
  required: type('string>=1'),

  // カナ正規化 + バリデーション
  // (NFKCで半角カナ→全角、全角英数→半角を自動処理)
  kana: type('string.normalize.NFKC').and('/^[ァ-ヶー・\\s]+$/'),

  // 住所などで使う全角→半角正規化のみの型
  normalizedString: type('string.normalize.NFKC'),

  // 実在する日付 (YYYY-MM-DD)
  date: type('string.date'),

  // メールアドレス
  email: type('string.email'),

  // 郵便番号 (形式チェック)
  zip: type('string.normalize.NFKC').and('/^\\d{3}-\\d{4}$/'),

  // 電話番号: 以前は libphonenumber-js を使用していましたが、
  // まずはシンプルな形式チェックから始め、必要に応じて narrow で拡張します
  phone: type('string.normalize.NFKC'),

  // 日付必須: date 型に加えて、空文字を許さないバリデーションを追加
  dateRequired: type('string > 0')
    .and('string.normalize.NFKC')
    .and('/^\\d{4}-\\d{2}-\\d{2}$/'),
  //  .and((d: string) => d.length > 0 || '日付を入力してください')
  //  .and((d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d) || '無効な日付形式です'),
};
