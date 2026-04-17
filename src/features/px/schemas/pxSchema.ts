import { type } from 'arktype';

import { ark } from '@/lib/ark';
import type { Database } from '@/types/database';

// 1. DBの型を抽出（検索用≒全項目を網羅）
export type PxRow = Database['public']['Tables']['px']['Row'];

/**
 * 2. DBの型 (PxRow['gender_code']) をベースにしたラベル定義
 * Record<型, ラベル> を使うことで、DBのカラム定義に変更があった場合にエラーで検知できます。
 */
export const GENDER_LABELS: Record<
  Exclude<PxRow['gender_code'], null>,
  string
> = {
  male: '男性',
  female: '女性',
  other: 'その他',
  unknown: '－',
} as const;

// 2.2 自動的に型を抽出 （例: type GenderCode = 'male' | 'female' | 'other' | 'unknown'）
export type GenderCode = keyof typeof GENDER_LABELS;

// 2.3UI用オプション配列 （例: セレクトボックスの選択肢など）も自動生成
export const GENDER_OPTIONS = (Object.keys(GENDER_LABELS) as GenderCode[]).map(
  (key) => ({
    value: key,
    label: GENDER_LABELS[key],
  }),
);

/**
 * 3. ベースとなる「全項目」バリデーション定義
 * 先頭に _ を付けて「内部用」であることを示し、PxRow と完全に同期させる
 */
const _pxBase = type({
  id: 'string',
  display_id: 'string',
  last_name: ark.required,
  first_name: ark.required,
  last_kana: ark.kana,
  first_kana: ark.kana,
  //gender_code: type.enumerated(GENDER_OPTIONS.map((opt) => opt.value)),
  gender_code: type.enumerated(...GENDER_OPTIONS.map((opt) => opt.value)),
  birthday: ark.date,
  tel: ark.required,
  email: ark.email.or("''"),
  zip: ark.zip.or("''"),
  addr1: ark.required,
  addr2: ark.optional,
  job: ark.optional,
  created_at: 'string',
  updated_at: 'string',
});

// 3.1 ベースから「全項目必須」の型を生成
export const pxSchema = _pxBase;
export type Px = typeof pxSchema.infer;
// 3.2 登録や更新の際の「初期値」として、id や日付を除いた形で定義
export const defaultPxValues: Omit<
  Px,
  'id' | 'display_id' | 'created_at' | 'updated_at' // これらはDBが自動生成するため、初期値には含めない
> = {
  last_name: '',
  first_name: '',
  last_kana: '',
  first_kana: '',
  gender_code: 'unknown',
  birthday: '',
  tel: '',
  email: '',
  zip: '',
  addr1: '',
  addr2: '',
  job: '',
};

// 4. ↓ ここからは「加工」だけで各用途の定義を作る
/**
 * 4.1 検索用 (Search)
 * 全項目を網羅しつつ、未入力(optional)でもOKにする
 */
export const pxSearchSchema = _pxBase.partial();
export type PxSearch = typeof pxSearchSchema.infer;

/**
 * 4.2 登録用 (Input/Insert)
 * DBが自動生成する id や日付を除去し、必要な項目だけを抽出
 */
export const pxInsertSchema = _pxBase.omit(
  'id',
  'display_id',
  'created_at',
  'updated_at',
);
export type PxInsert = typeof pxInsertSchema.infer;

/**
 * 4.3 更新用 (Update)
 * 登録用からさらに「一部の項目だけの送信」を許容する
 */
export const pxUpdateSchema = pxInsertSchema.partial();
export type PxUpdate = typeof pxUpdateSchema.infer;
