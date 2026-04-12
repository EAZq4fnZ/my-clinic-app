// src/features/patients/schemas/patient.ts
// 患者情報のスキーマを定義
import type { Database } from '@/types/database';
import { type } from 'arktype';

import { ark } from '@/lib/ark';

// 性別のラベル管理（JavaのEnum内フィールドのような役割）
export const GENDER_LABELS = {
  unknown: '－', // 未選択、不明（ドロップダウン上のデフォルト値）
  male: '男性',
  female: '女性',
  other: 'その他',
} as const;

export type GenderType = keyof typeof GENDER_LABELS;

// 1. DBの挿入用型を抽出
type PatientInsert = Database['public']['Tables']['patients']['Insert'];

// 2. DB定義をベースに ArkType スキーマを作成
// .and() を使うことで、DBの基本定義に「カナ正規化」などの業務ルールを追加できます
export const patientSchema = type({
  // DB定義そのまま（必須項目は required を使って明示）
  last_name: ark.required,
  first_name: ark.required,

  // DB定義 + 業務ルール（カナ、日付など）
  last_name_kana: ark.kana,
  first_name_kana: ark.kana,
  gender_type: type.enumerated(
    ...(Object.keys(GENDER_LABELS) as [GenderType, ...GenderType[]]),
  ),
  birth_date: ark.date,
  phone_number: ark.phone,
  zip_code: ark.zip,
  address_1: ark.normalizedString,

  // 任意項目は、DBの型に合わせつつ、空文字も許容する形で定義
  address_2: ark.normalizedString.or("''"), // 空文字も許容
  email: ark.email.or("''"), // 空文字も許容
  occupation: ark.normalizedString.or("''"), // 空文字も許容
}).as<PatientInsert>(); // 最後にDBの型と一致しているかチェック

export type PatientFormValues = typeof patientSchema extends type<infer U>
  ? U
  : never;

// フォームの初期値（DBの型と整合性を保ちつつ、業務ルールに合わせて適切なデフォルト値を設定）
export const defaultPatientValues: PatientFormValues = {
  display_id: '',
  last_name: '',
  first_name: '',
  last_name_kana: '',
  first_name_kana: '',
  gender_type: 'unknown' as GenderType,
  birth_date: null,
  phone_number: '',
  zip_code: '',
  address_1: '',
  address_2: '',
  email: '',
  occupation: '',
};
