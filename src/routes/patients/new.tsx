// src/routes/patients/new.tsx
import { createFileRoute, useNavigate } from '@tanstack/solid-router';
import { type Component, createSignal } from 'solid-js';

import { supabase } from '@/lib/supabase';
import { PatientForm } from '@features/patients/components/PatientForm';
import {
  type PatientFormValues,
  patientSchema,
} from '@features/patients/schemas/patient';

// 患者新規登録ページ
export const Route = createFileRoute('/patients/new')({
  component: PatientNewPage,
});

// 患者新規登録ページのコンポーネント
function PatientNewPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = async (values: PatientFormValues) => {
    // バリデーションはPatientForm内で行われるため、ここでは型安全な値が渡される前提
    const validatedData = patientSchema.parse(values);

    setIsLoading(true);
    // ここでSupabaseにデータを保存する
    try {
      // address_1, address_2 への分割対応版
      const { error } = await supabase
        .from('patients')
        .insert({
          last_name: values.last_name,
          first_name: values.first_name,
          last_name_kana: values.last_name_kana,
          first_name_kana: values.first_name_kana,
          gender_type: values.gender_type,
          birth_date: values.birth_date,
          zip_code: values.zip_code,
          address_1: values.address_1,
          address_2: values.address_2,
          phone_number: values.phone_number,
        })
        .select()
        .single();

      if (error) throw error;

      alert('患者情報を登録しました。');

      // 型安全な遷移
      navigate({ to: '/patients' });
    } catch (e: any) {
      if (e.name === 'ZodError') {
        console.error('バリデーションエラー:', e.errors);
        alert(
          `入力に誤りがあります: ${e.errors
            .map((err: any) => err.message)
            .join(', ')}`,
        );
        return;
      } else {
        console.error('保存エラー:', e);
        alert(`登録に失敗しました: ${e.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="max-w-4xl mx-auto py-8 px-4">
      <header class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800">患者新規登録</h1>
        <p class="text-sm text-gray-500 mt-1">
          基本情報を入力してください。生年月日は和暦でも確認できます。
        </p>
      </header>

      <PatientForm
        onSubmit={handleSubmit}
        onCancel={() => navigate({ to: '/patients' })}
        isLoading={isLoading()}
      />
    </div>
  );
}

export default PatientNewPage;
