// src/features/patients/components/PatientForm.tsx
import { createForm, formEventClient } from '@tanstack/solid-form';
import { ArkErrors } from 'arktype';
import { type Component, For } from 'solid-js';

import { formatZipCode, formatZipCodeWithHyphen } from '@/utils/zipCode';
import {
  GENDER_LABELS,
  type GenderType,
  defaultPatientValues,
  patientSchema,
} from '@f/patients/schemas/patient';
import { supabase } from '@lib/supabase';
import { EraDatePicker } from '@ui/EraDatePicker';
import { ZipAddressFields } from '@ui/ZipAddressFields';

export interface PatientFormProps {
  onSuccess: (patient: { id: string }) => void;
  onCancel: () => void;
}
// 患者情報登録フォームのコンポーネント
export const PatientForm: Component<PatientFormProps> = (props) => {
  const form = createForm(() => ({
    defaultValues: defaultPatientValues,
    onSubmit: async ({ value }) => {
      const result = patientSchema(value);

      if (result instanceof ArkErrors) {
        alert(`入力内容に不備があります:\n${result.summary}`);
        return;
      }

      // 成功時、result は正規化済みのオブジェクト
      const submitData = { ...(result as any) };

      // display_id はサーバー側で自動生成するため、空文字の場合は削除
      if (!submitData.display_id) {
        delete submitData.display_id;
      }
      // 郵便番号をハイフンありの形式に変換して保存
      if (submitData.zip_code) {
        const digits = formatZipCode(submitData.zip_code); // どんな形式でも一旦数字(7桁)にする
        // 7桁ならハイフンを付ける。そうでなければ（通常ありえないが）数字のみをセット
        submitData.zip_code =
          digits.length === 7 ? formatZipCodeWithHyphen(digits) : digits;
      }
      try {
        // supabase を使って patients テーブルにデータを挿入
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
            children={(f) => {
              // エラー箇所の修正：anyを介して string に変換することで never 回避
              const errorMsg = (f().state.meta.errors as any[])[0]?.toString();

              return (
                <EraDatePicker
                  label="生年月日"
                  value={f().state.value as string}
                  // null | undefined が来ても handleChange には文字列を渡す
                  onSelect={(val: string | null | undefined) =>
                    f().handleChange(val ?? '')
                  }
                  error={errorMsg}
                />
              );
            }}
          />
        </div>

        <hr class="border-gray-100" />

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

        <div class="grid grid-cols-2 gap-4">
          <form.Field
            name="phone_number"
            children={(f) => (
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-gray-500">
                  電話番号 <span class="text-red-500">*</span>
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
                  placeholder="任意"
                />
              </div>
            )}
          />
        </div>

        <form.Field
          name="occupation"
          children={(f) => (
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-gray-500">職業</label>
              <input
                value={f().state.value || ''}
                onInput={(e) => f().handleChange(e.currentTarget.value)}
                class="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="任意"
              />
            </div>
          )}
        />

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
