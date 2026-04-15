// @ui/FormRadioField.tsx
import { RadioGroup } from '@ark-ui/solid';
import { For } from 'solid-js';

import { FieldLayout, type FieldLayoutProps } from '@ui/shared/FieldLayout';

interface RadioOption {
  label: string;
  value: string;
}

interface Props extends FieldLayoutProps {
  options: RadioOption[];
}

export const FormRadioField = (props: Props) => {
  return (
    <FieldLayout
      label={props.label}
      field={props.field}
      helperText={props.helperText}
    >
      <RadioGroup.Root
        value={props.field.state.value}
        onValueChange={(details) => props.field.handleChange(details.value)}
        class="flex gap-4"
      >
        <For each={props.options}>
          {(option) => (
            <RadioGroup.Item
              value={option.value}
              class="flex items-center gap-2 cursor-pointer"
            >
              <RadioGroup.ItemControl class="w-4 h-4 border rounded-full border-slate-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" />
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
