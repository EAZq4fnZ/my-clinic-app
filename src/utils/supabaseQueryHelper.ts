// src/utils/supabaseQueryHelper.ts

export type SupabaseOperator =
  | 'eq' // 等しい(equal)
  | 'neq' // 等しくない(not equal)
  | 'gt' // より大きい(greater than)
  | 'gte' // より大きいか等しい(greater than or equal)
  | 'lt' // より小さい(less than)
  | 'lte' // より小さいか等しい(less than or equal)
  | 'like' // 部分一致（大文字小文字を区別）
  | 'ilike' // 部分一致（大文字小文字を区別しない）
  | 'is' // NULL チェック
  | 'in'; // 値のリストに含まれる

export interface SupabaseFilter {
  column: string; // フィルタを適用するカラム名
  op: SupabaseOperator; // 適用する演算子
  value: any; // フィルタの値（例: 'John'、30、['active', 'pending'] など）
}

/**
 * Supabaseのクエリに対して動的に複数のフィルタを適用する
 * 同じカラムに対する複数条件（範囲指定など）にも対応
 */
export const applyFilters = (query: any, filters: SupabaseFilter[]) => {
  // 有効な値を持つフィルタのみに絞り込む
  const activeFilters = filters.filter(
    (f) => f.value !== undefined && f.value !== null && f.value !== '',
  );

  // reduce を使い、一つ前のクエリ状態(q)に対して次のフィルタを適用して返す
  return activeFilters.reduce((q, f) => {
    const { column, op, value } = f;

    // LIKE系の加工
    const formattedValue =
      op === 'like' || op === 'ilike' ? `%${value}%` : value;

    // メソッドが存在するか確認して適用
    if (typeof q[op] === 'function') {
      // 重要：q.eq().gt() のように連鎖した新しいクエリインスタンスを返す
      return q[op](column, formattedValue);
    }

    return q;
  }, query);
};
