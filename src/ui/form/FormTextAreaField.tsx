// src/ui/form/FormTextAreaField.tsx
import { Field } from '@ark-ui/solid';
import { FieldLayout, type FieldLayoutProps } from '@ui/shared/FieldLayout';
import { type ComponentProps, splitProps } from 'solid-js';

interface Props
  extends Omit<FieldLayoutProps, 'children'>,
    Omit<ComponentProps<'textarea'>, 'children'> {}

export const FormTextAreaField = (props: Props) => {
  const [local, textareaProps] = splitProps(props, [
    'label',
    'field',
    'helperText',
  ]);

  return (
    <FieldLayout
      label={local.label}
      field={local.field}
      helperText={local.helperText}
    >
      <Field.Textarea
        {...textareaProps}
        value={local.field.state.value}
        onBlur={local.field.handleBlur}
        onInput={(e) => local.field.handleChange(e.currentTarget.value)}
        class="w-full border border-slate-300 rounded-md px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] disabled:bg-slate-50"
      />
    </FieldLayout>
  );
};
