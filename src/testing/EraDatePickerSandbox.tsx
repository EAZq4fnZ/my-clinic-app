// src/testing/EraDatePickerSandbox.tsx
import { createForm } from '@tanstack/solid-form';

import { EraDatePicker } from '@/ui/form/EraDatePicker/EraDatePicker';

export function EraDatePickerSandbox() {
  const form = createForm(() => ({
    defaultValues: {
      birthday: '1990-01-01',
    },
    onSubmit: async ({ value }) => {
      alert(`送信された値:\n${JSON.stringify(value, null, 2)}`);
      console.log('Form Submitted:', value);
    },
  }));

  return (
    <div class="p-6 border-2 border-dashed border-red-300 rounded-lg bg-red-50 max-w-2xl mx-auto my-10">
      <h2 class="text-xl font-bold text-red-600 mb-6 flex items-center gap-2">
        <span>🧪</span> Testing Sandbox
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        class="space-y-6"
      >
        <div class="bg-white p-4 rounded-md shadow-sm border border-red-100">
          <form.Field name="birthday">
            {(field) => (
              <EraDatePicker
                label="生年月日テスト"
                field={field}
                helperText="和暦が表示され、入力・選択ができるか確認してください"
              />
            )}
          </form.Field>
        </div>

        {/* 重要: form.Subscribe を使うことで、
          内部のステートが変更された際にこの範囲だけがリアクティブに再描画されます。
        */}
        <form.Subscribe selector={(state) => state}>
          {(state) => (
            <>
              <div class="flex items-center justify-between gap-4 bg-white p-4 rounded-md shadow-sm border border-red-100">
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Current State (Value)
                  </span>
                  <code class="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {state().values.birthday || '(empty)'}
                  </code>
                </div>

                <button
                  type="submit"
                  class="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-md shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>🚀</span> 送信して確認
                </button>
              </div>

              <div class="mt-6 p-4 bg-slate-800 rounded-md text-white">
                <p class="text-xs font-mono text-slate-400 mb-2">
                  // Full Form State Debug (Reactive)
                </p>
                <pre class="text-sm font-mono overflow-x-auto">
                  {JSON.stringify(state(), null, 2)}
                </pre>
              </div>
            </>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
