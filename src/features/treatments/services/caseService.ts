import { supabase } from '../../../api/supabase';
import type { TreatmentCase } from '@/types/database';

export const fetchAllCases = async () => {
  const { data, error } = await supabase
    .from('treatment_records')
    .select(`*, patients(*), accidents(*)`)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data; // 自動的に型が推論されます
};