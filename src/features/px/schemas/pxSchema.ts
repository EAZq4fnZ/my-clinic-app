// src/features/px/schemas/pxSchema.ts
import type { Type } from 'arktype';
import { type } from 'arktype';

import type { Database } from '@/types/database';
import { ark } from '@lib/ark';

// 1. DBの型を抽出
export type PxRow = Database['public']['Tables']['px']['Row'];

/**
 * 2. 性別定義
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

export type GenderCode = keyof typeof GENDER_LABELS;

export const GENDER_OPTIONS = (Object.keys(GENDER_LABELS) as GenderCode[]).map(
  (key) => ({
    value: key,
    label: GENDER_LABELS[key],
  }),
);

/**
 * 3. ベースとなるバリデーション定義（全項目）
 */
const _pxBase = type({
  id: 'string',
  display_id: 'string',
  last_name: ark.required,
  first_name: ark.required,
  last_kana: ark.kana,
  first_kana: ark.kana,
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

// 基本スキーマと型
export const pxSchema = _pxBase;
//export type Px = typeof pxSchema.infer;

/**
 * 4. 用途別のスキーマ加工
 */

// 4.1 登録用 (Insert): DB自動生成項目を除外
export const pxInsertSchema = _pxBase.omit(
  'id',
  'display_id',
  'created_at',
  'updated_at',
);
export type PxInsert = typeof pxInsertSchema.infer;

// 4.2 更新用 (Update): 登録用をベースに全項目を任意(partial)に
export const pxUpdateSchema = pxInsertSchema.partial();
export type PxUpdate = typeof pxUpdateSchema.infer;

// 4.3 検索用 (Search): 全項目を任意に
export const pxSearchSchema = _pxBase.partial();
export type PxSearch = typeof pxSearchSchema.infer;

/**
 * 5. バリデーター生成ヘルパー
 * 特定の pxSchema ではなく、広義の ArkType (AnyType) を受け入れるように変更します
 */

const createValidator = (schema: Type) =>
  ({
    onChange: ({ value }: { value: any }) => {
      const out = schema(value);
      return out instanceof type.errors ? out.summary : undefined;
    },
  }) satisfies Record<string, (args: { value: any }) => string | undefined>;

/**
 * 6. エクスポート用バリデーター
 * フォームの用途に合わせてこれらを使い分けます
 */
export const pxValidators = createValidator(pxSchema); // 全項目用
export const pxInsertValidators = createValidator(pxInsertSchema); // 登録用
export const pxUpdateValidators = createValidator(pxUpdateSchema); // 更新用
export const pxSearchValidators = createValidator(pxSearchSchema); // 検索用

/**
 * 7. 初期値定義
 */
export const defaultPxValues: PxInsert = {
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
