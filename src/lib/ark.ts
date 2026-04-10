// src/lib/ark.ts
import { type } from 'arktype';

/**
 * プロジェクト全域で共有する ArkType スキーマ定義
 */
export const ark = {
  // 実在する日付 (YYYY-MM-DD)
  date: type('string.date'),

  // メールアドレス
  email: type('string.email'),

  // カナ正規化 + バリデーション
  // (NFKCで半角カナ→全角、全角英数→半角を自動処理)
  kana: type('string.normalize.NFKC').and('/^[ァ-ヶー・\\s]+$/'),

  // 住所などで使う全角→半角正規化のみの型
  normalizedString: type('string.normalize.NFKC'),

  // 郵便番号 (形式チェック)
  zip: type('string.normalize.NFKC').and('/^\\d{3}-\\d{4}$/'),
};
