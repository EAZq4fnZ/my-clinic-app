// src/features/px/schemas/pxSchema.ts

import { ark } from '@/lib/ark';
import { type } from 'arktype';

export const GENDER_LABELS = {
  unknown: '－',
  male: '男性',
  female: '女性',
  other: 'その他',
} as const;

export type GenderType = keyof typeof GENDER_LABELS;

/*
  患者情報のスキーマ定義
  - ArkType を使用して、各フィールドのバリデーションルールを定義
*/
export const pxSchema = type({
  last_name: ark.required,
  first_name: ark.required,
  last_name_kana: ark.kana,
  first_name_kana: ark.kana,
  gender_type: type.enumerated(
    ...(Object.keys(GENDER_LABELS) as [GenderType, ...GenderType[]]),
  ),
  birth_date: ark.date,
  zip_code: ark.zip.or("''"), // 郵便番号は任意（空文字も許容）
  address_1: ark.required,
  address_2: ark.optional, // 住所2は任意（全角→半角正規化は行うが、空文字も許容）
  phone_number: ark.required, // 電話番号は必須,フォーマットは複雑なため ark ではバリデーションせず
  email: ark.email.or("''"), // メールは任意（空文字も許容）
  occupation: ark.optional,
  'display_id?': 'string',
});

export const defaultPatientValues = {
  last_name: '',
  first_name: '',
  last_name_kana: '',
  first_name_kana: '',
  gender_type: 'unknown' as GenderType,
  birth_date: '',
  zip_code: '',
  address_1: '',
  address_2: '',
  phone_number: '',
  email: '',
  occupation: '',
};
