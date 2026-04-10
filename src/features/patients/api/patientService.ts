import { supabase } from '@lib/supabase';
import type { Database } from '@/types/database';

export type PatientInsert = Database['public']['Tables']['patients']['Insert'];

export const createPatient = async (patient: PatientInsert) => {
  const { data, error } = await supabase
    .from('patients')
    .insert([patient])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ...fetchPatientsも同様
export const fetchPatients = async () => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};