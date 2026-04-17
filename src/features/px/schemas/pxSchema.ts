import { type } from 'arktype';

import { ark } from '@/lib/ark';
import type { Database } from '@/types/database';

/**
 * 性別ラベルの定義 (UI表示用)
 */
export const GENDER_LABELS = {
  male: '男性',
  female: '女性',
  other: 'その他',
  unknown: '－',
} as const;
// GenderCode は GENDER_LABELS のキーのみを許容する型として定義
export type GenderCode = keyof typeof GENDER_LABELS;
// GENDER_OPTIONS はセレクトボックスなどのUIコンポーネントで使用するための、valueとlabelのペアの配列として定義
export const GENDER_OPTIONS = (Object.keys(GENDER_LABELS) as GenderCode[]).map(
  (key) => ({
    value: key,
    label: GENDER_LABELS[key],
  }),
);

// 1. DBの型を抽出（検索用≒全項目を網羅）
export type PxRow = Database['public']['Tables']['px']['Row'];

/**
 * 2. ベースとなる「全項目」バリデーション定義
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

// --- ここからは「加工」だけで各用途の定義を作る ---

/**
 * A. 検索用 (Search)
 * 全項目を網羅しつつ、未入力(optional)でもOKにする
 */
export const pxSearchSchema = _pxBase.partial();
export type PxSearch = typeof pxSearchSchema.infer;

/**
 * B. 登録用 (Input/Insert)
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
 * C. 更新用 (Update)
 * 登録用からさらに「一部の項目だけの送信」を許容する
 */
export const pxUpdateSchema = pxInsertSchema.partial();
export type PxUpdate = typeof pxUpdateSchema.infer;
