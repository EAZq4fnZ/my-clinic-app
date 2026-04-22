// src/ui/shared/FormInputField.tsx
import { Field } from '@ark-ui/solid';
import { FieldLayout, type FieldLayoutProps } from '@ui/shared/FieldLayout';
import { type ComponentProps, splitProps } from 'solid-js';

// FieldLayoutProps から children を除いたものと、HTML標準の input 属性を結合
interface Props
  extends Omit<FieldLayoutProps, 'children'>,
    Omit<ComponentProps<'input'>, 'children'> {}

export const FormInputField = (props: Props) => {
  // 1. レイアウト用のプロパティ(local)と、input要素にそのまま渡すプロパティ(inputProps)に分ける
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
        {...inputProps} // placeholder, type, disabled, min, max 等がすべてここに展開される
        value={local.field.state.value}
        onBlur={local.field.handleBlur}
        onInput={(e) => local.field.handleChange(e.currentTarget.value)}
        class="h-10 w-full border border-slate-300 rounded-md px-3 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 transition-shadow"
      />
    </FieldLayout>
  );
};
