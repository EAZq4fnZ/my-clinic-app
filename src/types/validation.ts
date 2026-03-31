import { z } from 'zod';
import type { PatientInsert } from './database';

export const patientSchema = z.object({
  last_name: z.string().min(1, "姓を入力してください"),
  first_name: z.string().min(1, "名を入力してください"),
  last_name_kana: z.string().regex(/^[ァ-ヶー]+$/, "全角カタカナのみ"),
  first_name_kana: z.string().regex(/^[ァ-ヶー]+$/, "全角カタカナのみ"),
  phone_number: z.string().nullable().optional(),
  birth_date: z.string().nullable().optional(),
  zip_code: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
}) satisfies z.ZodType<Partial<PatientInsert>>;