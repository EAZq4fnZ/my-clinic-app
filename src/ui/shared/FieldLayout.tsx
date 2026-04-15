// @ui/shared/FieldLayout.tsx
import { Field } from '@ark-ui/solid';
import { type JSX, Show } from 'solid-js';

// 他の入力コンポーネントでも使い回す共通のインターフェース
export interface FieldLayoutProps {
  label: string;
  field: any; // TanStack Form の field() オブジェクト
  helperText?: string;
  children: JSX.Element;
}

export const FieldLayout = (props: FieldLayoutProps) => {
  return (
    <Field.Root
      // エラーがある場合に invalid 状態にする
      invalid={!!props.field.state.meta.errors.length}
      class="flex flex-col gap-1.5 w-full"
    >
      {/* ラベル部分 */}
      <Field.Label class="text-sm font-semibold text-slate-700">
        {props.label}
      </Field.Label>

      {/* 実際の入力要素（input, textarea, select等）がここに入る */}
      {props.children}

      {/* エラー表示とヘルパーテキストの切り替え */}
      <Show
        when={props.field.state.meta.errors.length > 0}
        fallback={
          props.helperText && (
            <Field.HelperText class="text-xs text-slate-500">
              {props.helperText}
            </Field.HelperText>
          )
        }
      >
        <Field.ErrorText class="text-xs text-red-500 font-medium">
          {props.field.state.meta.errors.join(', ')}
        </Field.ErrorText>
      </Show>
    </Field.Root>
  );
};
