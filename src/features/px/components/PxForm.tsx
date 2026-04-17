// src/features/patients/components/PatientForm.tsx
import { createForm } from '@tanstack/solid-form';
import { ArkErrors } from 'arktype';
import type { Component } from 'solid-js';

import {
  GENDER_LABELS,
  defaultPxValues,
  pxSchema,
} from '@/features/px/schemas/pxSchema';
//import { formatZipCode } from '@/utils/zipUtils';
import { FormEraDatePickerField } from '@ui/EraDatePicker';
import { FormInputField } from '@ui/FormInputField';
import { ZipCodeSearchField } from '@ui/ZipAddressFields';

export interface PatientFormProps {
  onSuccess: (patient: { id: string }) => void;
  onCancel: () => void;
}

export const PatientForm: Component<PatientFormProps> = (props) => {
  const form = createForm(() => ({
    defaultValues: defaultPxValues,
    onSubmit: async ({ value }) => {
      const result = pxSchema(value);
      if (result instanceof ArkErrors) {
        alert(`入力内容に不備があります:\n${result.summary}`);
        return;
      }

      // ここに Supabase への保存ロジックなどを記述
      console.log('Submit Value:', value);
      // props.onSuccess({ id: '...' });
    },
  }));

  return (
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        class="space-y-6"
      >
        <div class="grid grid-cols-2 gap-4">
          <form.Field name="last_name">
            {(field) => (
              <FormInputField label="姓" field={field()} placeholder="山田" />
            )}
          </form.Field>
          <form.Field name="first_name">
            {(field) => (
              <FormInputField label="名" field={field()} placeholder="太郎" />
            )}
          </form.Field>
        </div>

        {/* 郵便番号と住所の連動 */}
        <div class="bg-slate-50 p-4 rounded-xl space-y-4">
          <form.Field name="zip">
            {(field) => (
              <ZipCodeSearchField
                field={field()}
                onAddressFound={(res) => {
                  if (res.status === 200) {
                    // addr1 に都道府県＋市区町村＋町域をセット
                    form.setFieldValue('addr1', res.fullAddress);
                    // 必要に応じて他のフィールドも更新（例：カナなど）
                  }
                }}
              />
            )}
          </form.Field>

          <form.Field name="addr1">
            {(field) => (
              <FormInputField
                label="住所（自動入力）"
                field={field()}
                placeholder="郵便番号から自動入力されます"
              />
            )}
          </form.Field>

          <form.Field name="addr2">
            {(field) => (
              <FormInputField
                label="建物名・部屋番号"
                field={field()}
                placeholder="マンション名・号室など"
              />
            )}
          </form.Field>
        </div>

        <form.Field name="birthday">
          {(field) => (
            <FormEraDatePickerField label="生年月日" field={field()} />
          )}
        </form.Field>

        <div class="pt-6 flex gap-4">
          <button
            type="button"
            onClick={() => props.onCancel()}
            class="flex-1 border border-slate-300 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
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
