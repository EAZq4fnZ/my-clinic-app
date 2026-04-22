// src/features/px/api/pxApi.ts
import { supabase } from '@/lib/supabase';
import { type SupabaseFilter, applyFilters } from '@/utils/supabaseQueryHelper';
import type { PxSearch } from '../schemas/pxSchema';

export const fetchPatients = async (params: PxSearch) => {
  let query = supabase.from('px').select('*');

  // 複数条件を配列として定義
  const filters: SupabaseFilter[] = [
    // 同じカラムに複数の条件を指定可能（範囲検索）
    { column: 'accident_date', op: 'gte', value: params.startDate },
    { column: 'accident_date', op: 'lte', value: params.endDate },

    // 他の条件
    { column: 'last_kana', op: 'ilike', value: params.last_kana },
    { column: 'first_kana', op: 'ilike', value: params.first_kana },
    { column: 'status', op: 'eq', value: params.status },
  ];

  // ヘルパーが .gte().lte().ilike().eq() と繋いでくれる
  query = applyFilters(query, filters);

  const { data, error } = await query.order('last_name_kana', {
    ascending: true,
  });

  if (error) throw error;
  return data;
};
