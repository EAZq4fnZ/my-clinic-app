import { Button } from '@/ui/Button';
import { EraDatePicker } from '@/ui/EraDatePicker';
import { patientSchema } from '@features/patients/schemas/patient';
import { createForm } from '@tanstack/solid-form';
import { zodValidator } from '@tanstack/zod-adapter';
import { type Component, For } from 'solid-js';

interface PatientFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PatientForm: Component<PatientFormProps> = (props) => {
  const form = createForm(() => ({
    defaultValues: {
      last_name: props.initialData?.last_name || '',
      first_name: props.initialData?.first_name || '',
      last_name_kana: props.initialData?.last_name_kana || '',
      first_name_kana: props.initialData?.first_name_kana || '',
      birth_date: props.initialData?.birth_date || '1980-01-01',
      zip_code: props.initialData?.zip_code || '',
      address: props.initialData?.address || '',
      phone_number: props.initialData?.phone_number || '',
    },
    validatorAdapter: zodValidator(patientSchema), //

    onSubmit: async ({ value }) => {
      await props.onSubmit(value);
    },
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class="space-y-6 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form.Field name="last_name">
          {(field) => (
            <div class="space-y-1">
              <label class="text-sm font-bold text-gray-600">姓</label>
              <input
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
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
                class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage errors={field().state.meta.errors} />
            </div>
          )}
        </form.Field>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form.Field name="last_name_kana">
          {(field) => (
            <div class="space-y-1">
              <label class="text-sm font-bold text-gray-400">
                セイ（カナ）
              </label>
              <input
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                placeholder="さらだ → サラダに自動変換"
              />
              <ErrorMessage errors={field().state.meta.errors} />
            </div>
          )}
        </form.Field>
        <form.Field name="first_name_kana">
          {(field) => (
            <div class="space-y-1">
              <label class="text-sm font-bold text-gray-400">
                メイ（カナ）
              </label>
              <input
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
              />
              <ErrorMessage errors={field().state.meta.errors} />
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="birth_date">
        {(field) => (
          <EraDatePicker
            label="生年月日"
            value={field().state.value}
            onSelect={(date) => field().handleChange(date)}
          />
        )}
      </form.Field>

      <div class="pt-4 border-t border-gray-100 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field name="zip_code">
            {(field) => (
              <div class="space-y-1">
                <label class="text-sm font-bold text-gray-600">郵便番号</label>
                <input
                  value={field().state.value}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono"
                />
                <ErrorMessage errors={field().state.meta.errors} />
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
                <ErrorMessage errors={field().state.meta.errors} />
              </div>
            )}
          </form.Field>
        </div>
        <form.Field name="address">
          {(field) => (
            <div class="space-y-1">
              <label class="text-sm font-bold text-gray-600">住所</label>
              <textarea
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                rows={2}
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <ErrorMessage errors={field().state.meta.errors} />
            </div>
          )}
        </form.Field>
      </div>

      <div class="pt-6 flex items-center justify-end gap-4">
        <Button variant="ghost" type="button" onClick={() => props.onCancel()}>
          キャンセル
        </Button>
        {/* selector をオブジェクト形式に修正し、型エラー ts(2488) を回避 */}
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
      {(err) => <p class="text-xs text-red-500">{err}</p>}
    </For>
  </div>
);
