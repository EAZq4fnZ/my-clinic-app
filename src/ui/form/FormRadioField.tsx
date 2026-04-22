// src/ui/form/FormRadioField.tsx
import { RadioGroup } from '@ark-ui/solid';
import { FieldLayout, type FieldLayoutProps } from '@ui/shared/FieldLayout';
import { For, splitProps } from 'solid-js';

interface RadioOption {
  label: string;
  value: string | number;
}

interface Props extends Omit<FieldLayoutProps, 'children'> {
  options: RadioOption[];
}

export const FormRadioField = (props: Props) => {
  const [local, rest] = splitProps(props, [
    'label',
    'field',
    'helperText',
    'options',
  ]);

  return (
    <FieldLayout
      label={local.label}
      field={local.field}
      helperText={local.helperText}
    >
      <RadioGroup.Root
        value={String(local.field.state.value)} // 文字列として扱う
        onValueChange={(details) => local.field.handleChange(details.value)}
        class="flex gap-4 pt-1"
        {...rest}
      >
        <For each={local.options}>
          {(option) => (
            <RadioGroup.Item
              value={String(option.value)}
              class="flex items-center gap-2 cursor-pointer group"
            >
              <RadioGroup.ItemControl class="w-4 h-4 border rounded-full border-slate-300 group-data-[state=checked]:bg-blue-500 group-data-[state=checked]:border-blue-500 flex items-center justify-center">
                <div class="w-1.5 h-1.5 bg-white rounded-full" />
              </RadioGroup.ItemControl>
              <RadioGroup.ItemText class="text-sm text-slate-700">
                {option.label}
              </RadioGroup.ItemText>
              <RadioGroup.ItemHiddenInput />
            </RadioGroup.Item>
          )}
        </For>
      </RadioGroup.Root>
    </FieldLayout>
  );
};
