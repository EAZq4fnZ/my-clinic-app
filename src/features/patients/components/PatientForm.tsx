// src/features/patients/components/PatientForm.tsx
import { ArkErrors } from 'arktype';
import { type Component, For } from 'solid-js';

import { supabase } from '@/lib/supabase';
import { EraDatePicker } from '@/ui/EraDatePicker';
import {
  GENDER_LABELS,
  type GenderType,
  defaultPatientValues,
  patientSchema,
} from '@f/patients/schemas/patient';
import { createForm } from '@tanstack/solid-form';
import { ZipAddressFields } from '@ui/ZipAddressFields';

export interface PatientFormProps {
  onSuccess: (patient: { id: string }) => void;
  onCancel: () => void;
}

export const PatientForm: Component<PatientFormProps> = (props) => {
  const form = createForm(() => ({
    defaultValues: defaultPatientValues,
    onSubmit: async ({ value }) => {
      const result = patientSchema(value);

      // ArkErrors インスタンスかどうかで厳格に判定
      if (result instanceof ArkErrors) {
        alert(`入力内容に不備があります:\n${result.summary}`);
        return;
      }

      // バリデーション成功後のデータ
      const submitData = { ...result };

      // 新規登録時に display_id が空なら DB の自動採番に任せる
      if (!submitData.display_id) {
        delete (submitData as any).display_id;
      }

      try {
        const { data, error: dbError } = await supabase
          .from('patients')
          .insert(submitData)
          .select()
          .single();

        if (dbError) throw dbError;
        if (data) props.onSuccess(data);
      } catch (err) {
        console.error('登録エラー:', err);
        alert('保存に失敗しました。');
      }
    },
  }));

  return (
    <div class="max-w-2xl mx-auto p-4 bg-white shadow-sm rounded-xl border border-gray-100">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        class="space-y-6"
      >
        {/* 氏名 */}
        <div class="grid grid-cols-2 gap-4">
          <form.Field
            name="last_name"
            children={(f) => (
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-gray-500">
                  姓 <span class="text-red-500">*</span>
                </label>
                <input
                  value={f().state.value}
                  onInput={(e) => f().handleChange(e.currentTarget.value)}
                  class="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="田中"
                />
              </div>
            )}
          />
          <form.Field
            name="first_name"
            children={(f) => (
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-gray-500">
                  名 <span class="text-red-500">*</span>
                </label>
                <input
                  value={f().state.value}
                  onInput={(e) => f().handleChange(e.currentTarget.value)}
                  class="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="太郎"
                />
              </div>
            )}
          />
        </div>

        {/* カナ */}
        <div class="grid grid-cols-2 gap-4">
          <form.Field
            name="last_name_kana"
            children={(f) => (
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-gray-500">
                  セイ（カナ） <span class="text-red-500">*</span>
                </label>
                <input
                  value={f().state.value}
                  onInput={(e) => f().handleChange(e.currentTarget.value)}
                  class="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          />
          <form.Field
            name="first_name_kana"
            children={(f) => (
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-gray-500">
                  メイ（カナ） <span class="text-red-500">*</span>
                </label>
                <input
                  value={f().state.value}
                  onInput={(e) => f().handleChange(e.currentTarget.value)}
                  class="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          {/* 性別：GENDER_LABELSのキーをvalueとして利用 */}
          <form.Field
            name="gender_type"
            children={(f) => (
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-gray-500">性別</label>
                <select
                  value={f().state.value}
                  onChange={(e) =>
                    f().handleChange(e.currentTarget.value as GenderType)
                  }
                  class="border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <For each={Object.entries(GENDER_LABELS)}>
                    {([key, label]) => <option value={key}>{label}</option>}
                  </For>
                </select>
              </div>
            )}
          />

          <form.Field
            name="birth_date"
            children={(f) => (
              <EraDatePicker
                label="生年月日"
                value={f().state.value as string | null}
                onSelect={(val) => f().handleChange(val)}
                error={
                  f().state.meta.errors[0]
                    ? String(f().state.meta.errors[0])
                    : undefined
                }
              />
            )}
          />
        </div>

        <hr class="border-gray-100" />

        {/* 住所関連（共通コンポーネント） */}
        <form.Field
          name="zip_code"
          children={(zf) => (
            <form.Field
              name="address_1"
              children={(af) => (
                <ZipAddressFields zipField={zf()} addressField={af()} />
              )}
            />
          )}
        />

        <form.Field
          name="address_2"
          children={(f) => (
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-gray-500">
                住所（番地・建物名）
              </label>
              <input
                value={f().state.value || ''}
                onInput={(e) => f().handleChange(e.currentTarget.value)}
                class="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="任意"
              />
            </div>
          )}
        />

        {/* メール・職業 */}
        <div class="grid grid-cols-2 gap-4">
          <form.Field
            name="email"
            children={(f) => (
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-gray-500">
                  メールアドレス
                </label>
                <input
                  type="text"
                  value={f().state.value || ''}
                  onInput={(e) => f().handleChange(e.currentTarget.value)}
                  class="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="任意（空欄可）"
                />
              </div>
            )}
          />
          <form.Field
            name="occupation"
            children={(f) => (
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-gray-500">職業</label>
                <input
                  value={f().state.value || ''}
                  onInput={(e) => f().handleChange(e.currentTarget.value)}
                  class="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="任意（空欄可）"
                />
              </div>
            )}
          />
        </div>

        <div class="pt-6 flex gap-4">
          <button
            type="button"
            onClick={() => props.onCancel()}
            class="flex-1 border border-gray-300 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            class="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-colors"
          >
            登録する
          </button>
        </div>
      </form>
    </div>
  );
};
