// 患者情報のスキーマを定義

import { z } from 'zod';

import {
  createKatakanaSchema,
  dateSchema,
  phoneNumberSchema,
  zipCodeSchema,
} from '@/lib/zod-common';

// 性別のラベル管理（JavaのEnum内フィールドのような役割）
export const GENDER_LABELS = {
  unknown: '－', // 未選択、不明（ドロップダウン上のデフォルト値）
  male: '男性',
  female: '女性',
  other: 'その他',
} as const;

/**
 * 患者情報のバリデーション & 変換スキーマ
 */
//  1. 基本情報（名前、カナ）
//  2. 生年月日（EraDatePickerから "YYYY-MM-DD" が渡される想定）
//  3. 電話番号（全角変換 -> 有効性チェック -> ナショナル形式へ整形）
//  4. 郵便番号（全角変換 -> ハイフン付与 -> 形式チェック）
//  5. 住所（市区町村、番地）
//  6. その他のフィールドも必要に応じて追加可能（例：性別、メールアドレスなど）
export const patientSchema = z.object({
  // 1. 基本情報（名前、カナ）
  last_name: z.string().min(1, '姓を入力してください'),
  first_name: z.string().min(1, '名を入力してください'),
  last_name_kana: createKatakanaSchema(
    '【患者登録】姓（カナ）は全角カタカナで入力してください',
  ),
  first_name_kana: createKatakanaSchema(
    '【患者登録】名（カナ）は全角カタカナで入力してください',
  ),

  // 2. 生年月日 (EraDatePickerから "YYYY-MM-DD" が渡される想定)
  birth_date: dateSchema,

  // 3. 電話番号 (全角変換 -> 有効性チェック -> ナショナル形式へ整形)
  phone_number: phoneNumberSchema,

  // 4. 郵便番号 (全角変換 -> ハイフン付与 -> 形式チェック)
  zip_code: zipCodeSchema,

  // 5. 住所
  address_1: z.string().min(1, '住所（市区町村）を入力してください').optional(),
  address_2: z.string().min(1, '住所（番地）を入力してください').optional(),

  // 6. その他のフィールドも必要に応じて追加可能
  gender_type: z
    .enum(['male', 'female', 'other', 'unknown'])
    .default('unknown'),
  email: z.string().email('有効なメールアドレスを入力してください').optional(),
});

/**
 * TypeScript 型定義
 * z.infer を使うことで、transform 後の型（綺麗なデータ型）が抽出されます
 */
export type PatientFormValues = z.infer<typeof patientSchema>;

// フォームの初期値（バリデーションエラーを避けるため、必須フィールドは空文字やデフォルト値で初期化）
export const defaultPatientValues: PatientFormValues = {
  last_name: '',
  first_name: '',
  last_name_kana: '',
  first_name_kana: '',
  gender_type: 'unknown',
  birth_date: '1980-01-01',
  zip_code: '',
  address_1: '',
  address_2: '',
  phone_number: '',
};
