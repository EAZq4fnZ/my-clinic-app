// @ui/FormInputField.tsx
import { Field } from '@ark-ui/solid';
import type { FieldApi } from '@tanstack/solid-form';
import { type ComponentProps, splitProps } from 'solid-js';

// 必要な型引数をコンポーネント全体で受け取る
interface Props extends ComponentProps<typeof Field.Input> {
  label: string;
  field: any;
  helperText?: string;
}

export const FormInputField = (props: Props) => {
  const [local, inputProps] = splitProps(props, [
    'label',
    'field',
    'helperText',
  ]);

  return (
    <Field.Root
      invalid={!!local.field.state.meta.errors.length}
      class="flex flex-col gap-1.5"
    >
      <Field.Label class="text-sm font-semibold text-slate-700">
        {local.label}
      </Field.Label>

      <Field.Input
        {...inputProps}
        value={local.field.state.value}
        onBlur={local.field.handleBlur}
        onInput={(e) => local.field.handleChange(e.currentTarget.value as any)}
        class="border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {local.field.state.meta.errors.length > 0 ? (
        <Field.ErrorText class="text-xs text-red-500 font-medium">
          {local.field.state.meta.errors.join(', ')}
        </Field.ErrorText>
      ) : (
        local.helperText && (
          <Field.HelperText class="text-xs text-slate-500 font-normal">
            {local.helperText}
          </Field.HelperText>
        )
      )}
    </Field.Root>
  );
};
