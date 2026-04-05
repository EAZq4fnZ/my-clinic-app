// @routes/patients/new.tsx
import { supabase } from '@/lib/supabase';
import { PatientForm } from '@features/patients/components/PatientForm';
import type { PatientFormValues } from '@features/patients/schemas/patient';
import { useNavigate } from '@tanstack/solid-router';
import { type Component, createSignal } from 'solid-js';

const PatientNewPage: Component = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = async (values: PatientFormValues) => {
    setIsLoading(true);
    try {
      // Supabaseへの保存処理
      const { error } = await supabase
        .from('patients')
        .insert({
          last_name: values.last_name,
          first_name: values.first_name,
          last_name_kana: values.last_name_kana,
          first_name_kana: values.first_name_kana,
          gender: values.gender, // Enum型(male/female/other/unknown)
          birth_date: values.birth_date,
          zip_code: values.zip_code,
          address_1: values.address_1, // 修正点：addressから分割
          address_2: values.address_2, // 修正点：addressから分割
          phone_number: values.phone_number,
        })
        .select()
        .single();

      if (error) throw error;

      alert('患者情報を登録しました。');

      // 登録成功後、一覧画面に戻る（または詳細画面へ）
      navigate({ to: '/patients' });
    } catch (e: any) {
      console.error('保存エラー:', e);
      alert(`登録に失敗しました: ${e.message}`);
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
};

export default PatientNewPage;
