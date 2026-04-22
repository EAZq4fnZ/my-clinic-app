// src/ui/shared/FieldLayout.tsx
import { Field } from '@ark-ui/solid';
import { type JSX, Show } from 'solid-js';

export interface FieldLayoutProps {
  label: string;
  field: any;
  helperText?: string;
  children: JSX.Element;
}

export const FieldLayout = (props: FieldLayoutProps) => {
  // errors が undefined の場合も考慮して安全に判定
  const hasError = () => (props.field.state.meta.errors?.length ?? 0) > 0;

  return (
    <Field.Root invalid={hasError()} class="flex flex-col gap-1.5 w-full">
      <Field.Label class="text-sm font-semibold text-slate-700">
        {props.label}
      </Field.Label>

      {props.children}

      <Show
        when={hasError()}
        fallback={
          <Show when={props.helperText}>
            <Field.HelperText class="text-xs text-slate-500">
              {props.helperText}
            </Field.HelperText>
          </Show>
        }
      >
        <Field.ErrorText class="text-xs text-red-500 font-medium">
          {props.field.state.meta.errors.join(', ')}
        </Field.ErrorText>
      </Show>
    </Field.Root>
  );
};
