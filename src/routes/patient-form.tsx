import { createMutation, useQueryClient } from '@tanstack/solid-query';
import { createFileRoute, useNavigate } from '@tanstack/solid-router';
import { createSignal } from 'solid-js';

import type { Database } from '@/types/database';
import { createPatient } from '@features/patients/services/patientService';
import EraDatePicker from '@ui/EraDatePicker';

// Database 型から Insert 用の型を抽出（これで PatientInsert 自体のエクスポート不要）
type PatientInsert = Database['public']['Tables']['patients']['Insert'];

export const Route = createFileRoute('/patient-form')({
  component: PatientFormPage,
});

function PatientFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 状態管理（画像 の未使用警告を解消するためすべて使用します）
  const [firstName, setFirstName] = createSignal('');
  const [lastName, setLastName] = createSignal('');
  const [firstNameKana, setFirstNameKana] = createSignal('');
  const [lastNameKana, setLastNameKana] = createSignal('');
  const [birthDate, setBirthDate] = createSignal('');
  const [gender, setGender] = createSignal<'男性' | '女性' | 'その他' | null>(
    null,
  );

  const mutation = createMutation(() => ({
    mutationFn: (newPatient: PatientInsert) => createPatient(newPatient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      alert('登録が完了しました');
      navigate({ to: '/patients' });
    },
    onError: (err: Error) => alert('エラー: ' + err.message),
  }));

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (!firstName() || !lastName() || !birthDate()) {
      alert('姓名と生年月日は必須です');
      return;
    }

    // 型エラーを消すために DB 定義の全プロパティに値を割り当てる
    const payload: PatientInsert = {
      first_name: firstName(),
      last_name: lastName(),
      first_name_kana: firstNameKana(),
      last_name_kana: lastNameKana(),
      birth_date: birthDate() || null,
      address: null,
      phone_number: null,
      email: null,
      occupation: null,
      zip_code: null,
      // id, created_at は自動生成のため省略可
    };

    mutation.mutate(payload);
  };

  return (
    <div class="p-8 max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-6 text-gray-800">新規患者登録</h1>

      <form
        onSubmit={handleSubmit}
        class="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <div class="grid grid-cols-2 gap-4">
          {/* 氏名 */}
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700">姓名</label>
            <div class="flex gap-2">
              <input
                type="text"
                placeholder="姓"
                class="border p-2 rounded-lg w-full"
                onInput={(e) => setLastName(e.currentTarget.value)}
              />
              <input
                type="text"
                placeholder="名"
                class="border p-2 rounded-lg w-full"
                onInput={(e) => setFirstName(e.currentTarget.value)}
              />
            </div>
          </div>

          {/* フリガナ */}
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700">フリガナ</label>
            <div class="flex gap-2">
              <input
                type="text"
                placeholder="セイ"
                class="border p-2 rounded-lg w-full"
                value={lastNameKana()}
                onInput={(e) => setLastNameKana(e.currentTarget.value)}
              />
              <input
                type="text"
                placeholder="メイ"
                class="border p-2 rounded-lg w-full"
                value={firstNameKana()}
                onInput={(e) => setFirstNameKana(e.currentTarget.value)}
              />
            </div>
          </div>
        </div>

        {/* 性別 */}
        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-gray-700">性別</label>
          <div class="flex gap-4">
            {['男性', '女性', 'その他'].map((v) => (
              <label class="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={gender() === v}
                  onChange={() => setGender(v as any)}
                />
                <span class="text-sm">{v}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 生年月日 */}
        {<EraDatePicker label="生年月日" required onChange={setBirthDate} />}

        <div class="pt-4 border-t">
          <button
            type="submit"
            disabled={mutation.isPending}
            class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {mutation.isPending ? '保存中...' : '登録する'}{' '}
          </button>
        </div>
      </form>
    </div>
  );
}
