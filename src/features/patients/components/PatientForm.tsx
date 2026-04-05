// @/features/patients/components/PatientForm.tsx
import { createForm } from '@tanstack/solid-form';
import { zodValidator } from '@tanstack/zod-adapter';
import { type Component, For } from 'solid-js';

import { Button } from '@/components/ui/Button';
import { EraDatePicker } from '@/components/ui/EraDatePicker';
import {
  GENDER_LABELS,
  type PatientFormValues,
  defaultPatientValues,
  patientSchema,
} from '@features/patients/schemas/patient';

interface PatientFormProps {
  initialData?: Partial<PatientFormValues>;
  onSubmit: (data: PatientFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PatientForm: Component<PatientFormProps> = (props) => {
  const form = createForm(() => ({
    defaultValues: {
      ...defaultPatientValues,
      ...props.initialData,
    },
    validatorAdapter: zodValidator(patientSchema),
    onSubmit: async ({ value }) => {
      await props.onSubmit(value);
    },
  }));

  // 郵便番号から住所1(address_1)を自動入力
  const handleZipSearch = async (code: string) => {
    const cleanCode = code.replace(/\D/g, '');
    if (cleanCode.length === 7) {
      try {
        const res = await fetch(
          `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanCode}`,
        );
        const data = await res.json();
        if (data.results) {
          const r = data.results[0];
          form.setFieldValue(
            'address_1',
            `${r.address1}${r.address2}${r.address3}`,
          );
        }
      } catch (e) {
        console.error('住所検索失敗', e);
      }
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class="space-y-6 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100"
    >
      {/* 氏名エリア */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form.Field name="last_name">
          {(field) => (
            <div class="space-y-1">
              <label class="text-sm font-bold text-gray-600">姓</label>
              <input
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                onBlur={field().handleBlur}
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <ErrorMessage errors={field().state.meta.errors} />
            </div>
          )}
        </form.Field>
        <form.Field name="first_name">
          {(field) => (
            <div class="space-y-1">
              <label class="text-sm font-bold text-gray-600">名</label>
              <input
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                onBlur={field().handleBlur}
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <ErrorMessage errors={field().state.meta.errors} />
            </div>
          )}
        </form.Field>
      </div>

      {/* 性別と生年月日 */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form.Field name="gender_type">
          {(field) => (
            <div class="space-y-1">
              <label class="text-sm font-bold text-gray-600">性別</label>
              <select
                value={field().state.value}
                onChange={(e) =>
                  field().handleChange(e.currentTarget.value as any)
                }
                class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
              >
                <For each={Object.entries(GENDER_LABELS)}>
                  {([value, label]) => <option value={value}>{label}</option>}
                </For>
              </select>
            </div>
          )}
        </form.Field>

        <form.Field name="birth_date">
          {(field) => (
            <div class="space-y-1">
              <EraDatePicker
                label="生年月日"
                value={field().state.value}
                onSelect={(date) => field().handleChange(date)}
              />
            </div>
          )}
        </form.Field>
      </div>

      {/* 住所セクション */}
      <div class="pt-4 border-t border-gray-100 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field name="zip_code">
            {(field) => (
              <div class="space-y-1">
                <label class="text-sm font-bold text-gray-600">郵便番号</label>
                <input
                  value={field().state.value}
                  onInput={(e) => {
                    field().handleChange(e.currentTarget.value);
                    handleZipSearch(e.currentTarget.value);
                  }}
                  placeholder="1230001"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono"
                />
              </div>
            )}
          </form.Field>
          <form.Field name="phone_number">
            {(field) => (
              <div class="space-y-1">
                <label class="text-sm font-bold text-gray-600">電話番号</label>
                <input
                  value={field().state.value}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono"
                />
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="address_1">
          {(field) => (
            <div class="space-y-1">
              <label class="text-sm font-bold text-gray-600">
                住所1（市区町村まで）
              </label>
              <input
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="address_2">
          {(field) => (
            <div class="space-y-1">
              <label class="text-sm font-bold text-gray-600">
                住所2（番地・建物名）
              </label>
              <input
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          )}
        </form.Field>
      </div>

      {/* アクションボタン */}
      <div class="pt-6 flex items-center justify-end gap-4">
        <Button variant="ghost" type="button" onClick={() => props.onCancel()}>
          キャンセル
        </Button>

        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {(state) => (
            <Button
              variant="primary"
              type="submit"
              disabled={!state().canSubmit}
              isLoading={state().isSubmitting || props.isLoading}
              class="w-full md:w-auto md:px-12"
            >
              保存する
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
};

const ErrorMessage: Component<{ errors: any[] }> = (props) => (
  <div class="min-h-[1.25rem]">
    <For each={props.errors}>
      {(err) => <p class="text-xs text-red-500 font-medium">{err}</p>}
    </For>
  </div>
);
