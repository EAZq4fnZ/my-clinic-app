// @ui/FormInputField.tsx
import { Field } from '@ark-ui/solid';
import { type ComponentProps, splitProps } from 'solid-js';

import { FieldLayout, type FieldLayoutProps } from '@ui/shared/FieldLayout';

// FieldLayoutProps と HTML標準の input 属性を統合
interface Props
  extends Omit<FieldLayoutProps, 'children'>,
    Omit<ComponentProps<'input'>, 'children'> {}

export const FormInputField = (props: Props) => {
  // splitProps でレイアウト用と input要素用を分ける
  const [local, inputProps] = splitProps(props, [
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
      <Field.Input
        {...inputProps}
        // TanStack Form の状態とイベントを紐付け
        value={local.field.state.value}
        onBlur={local.field.handleBlur}
        onInput={(e) => local.field.handleChange(e.currentTarget.value)}
        class="border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500"
      />
    </FieldLayout>
  );
};
