// src/features/px/components/pxForm.tsx
import { createForm } from '@tanstack/solid-form';
import type { Type } from 'arktype';
import { For } from 'solid-js';

import { GENDER_OPTIONS } from '@/constants/gender';

interface PxFormProps {
  /** 親から渡される初期値（PxInsert型 または PxUpdate型） */
  defaultValues: any;
  /** 親から渡されるバリデーターセット（pxInsertValidators など） */
  validators: Record<string, (args: { value: any }) => string | undefined>;
  /** 親から渡される正規化用のArkTypeスキーマ */
  schema: Type<any, any>;
  /** 処理完了後のコールバック（正規化済みのデータを親に返す） */
  onSubmit: (data: any) => Promise<void>;
  /** キャンセル時の処理 */
  onCancel: () => void;
}

export const PxForm = (props: PxFormProps) => {
  const form = createForm(() => ({
    defaultValues: props.defaultValues,
    validators: props.validators,
    onSubmit: async ({ value }) => {
      // 1. 送信直前に、親から受け取ったスキーマで「正規化(Morph)」を実行
      const out = props.schema(value);

      // 2. 万が一エラーがあれば中断（通常はonChangeで防がれているはず）
      if (out instanceof Error || (out as any).errors) {
        return;
      }

      // 3. 正規化された「綺麗なデータ」を親のonSubmitに渡す
      await props.onSubmit(out);
    },
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class="space-y-4 p-4"
    >
      <div class="grid grid-cols-2 gap-4">
        {/* 氏名（姓） */}
        <form.Field name="last_name">
          {(field) => (
            <div>
              <label class="block text-sm font-medium">姓</label>
              <input
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                class="w-full border rounded p-2"
              />
              {field().state.meta.errors && (
                <span class="text-red-500 text-xs">
                  {field().state.meta.errors}
                </span>
              )}
            </div>
          )}
        </form.Field>

        {/* 氏名（名） */}
        <form.Field name="first_name">
          {(field) => (
            <div>
              <label class="block text-sm font-medium">名</label>
              <input
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                class="w-full border rounded p-2"
              />
            </div>
          )}
        </form.Field>
      </div>

      {/* 性別 */}
      <form.Field name="gender_code">
        {(field) => (
          <div>
            <label class="block text-sm font-medium">性別</label>
            <select
              value={field().state.value}
              onChange={(e) => field().handleChange(e.currentTarget.value)}
              class="w-full border rounded p-2"
            >
              <For each={GENDER_OPTIONS}>
                {(option) => (
                  <option value={option.value}>{option.label}</option>
                )}
              </For>
            </select>
          </div>
        )}
      </form.Field>

      {/* 電話番号 */}
      <form.Field name="tel">
        {(field) => (
          <div>
            <label class="block text-sm font-medium">電話番号</label>
            <input
              value={field().state.value}
              onInput={(e) => field().handleChange(e.currentTarget.value)}
              placeholder="090-0000-0000"
              class="w-full border rounded p-2"
            />
            {field().state.meta.errors && (
              <span class="text-red-500 text-xs">
                {field().state.meta.errors}
              </span>
            )}
          </div>
        )}
      </form.Field>

      {/* ボタン類 */}
      <div class="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={props.onCancel}
          class="px-4 py-2 border rounded hover:bg-gray-100"
        >
          キャンセル
        </button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {(state) => (
            <button
              type="submit"
              disabled={!state()[0]}
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {state()[1] ? '保存中...' : '保存'}
            </button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
};
