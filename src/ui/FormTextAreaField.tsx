// @ui/FormTextAreaField.tsx
import { Field } from '@ark-ui/solid';
import { type ComponentProps, splitProps } from 'solid-js';

import { FieldLayout, type FieldLayoutProps } from '@ui/shared/FieldLayout';

interface Props
  extends FieldLayoutProps,
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
      <Field.Input>
        <textarea
          {...textareaProps}
          value={local.field.state.value}
          onBlur={local.field.handleBlur}
          onInput={(e) => local.field.handleChange(e.currentTarget.value)}
          class="border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
        />
      </Field.Input>
    </FieldLayout>
  );
};
