import { FieldLayout, type FieldLayoutProps } from '@/ui/form/FieldLayout';
// src/ui/form/FormSegmentField.tsx
import { SegmentGroup } from '@ark-ui/solid';
import { For, createMemo, splitProps } from 'solid-js';

interface Option {
  label: string;
  value: string;
}

interface Props extends Omit<FieldLayoutProps, 'children'> {
  options: Option[];
}

export const FormSegmentField = (props: Props) => {
  const [local, rest] = splitProps(props, [
    'label',
    'field',
    'helperText',
    'options',
  ]);
  const getField = () =>
    typeof local.field === 'function' ? local.field() : local.field;

  return (
    <FieldLayout
      label={local.label}
      field={getField()}
      helperText={local.helperText}
    >
      <SegmentGroup.Root
        value={getField().state.value}
        onValueChange={(details) => getField().handleChange(details.value)}
        class="flex bg-slate-100 p-1 rounded-lg w-fit"
      >
        <For each={local.options}>
          {(option) => (
            <SegmentGroup.Item
              value={option.value}
              class="relative cursor-pointer px-4 py-1.5 rounded-md transition-all data-[state=checked]:bg-white data-[state=checked]:shadow-sm"
            >
              <SegmentGroup.ItemText class="text-sm font-medium text-slate-600 data-[state=checked]:text-blue-600">
                {option.label}
              </SegmentGroup.ItemText>
              <SegmentGroup.ItemControl />
              <SegmentGroup.ItemHiddenInput />
            </SegmentGroup.Item>
          )}
        </For>
      </SegmentGroup.Root>
    </FieldLayout>
  );
};
