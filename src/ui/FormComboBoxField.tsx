// @ui/FormComboBoxField.tsx
import { Combobox, createListCollection } from '@ark-ui/solid';
import { For, createMemo } from 'solid-js';

import { FieldLayout, type FieldLayoutProps } from '@ui/shared/FieldLayout';

interface Props extends FieldLayoutProps {
  items: string[];
  placeholder?: string;
}

export const FormComboBoxField = (props: Props) => {
  const collection = createMemo(() =>
    createListCollection({ items: props.items }),
  );

  return (
    <FieldLayout
      label={props.label}
      field={props.field}
      helperText={props.helperText}
    >
      <Combobox.Root
        collection={collection()}
        value={[props.field.state.value]}
        onValueChange={(details) => props.field.handleChange(details.value[0])}
        onExitComplete={props.field.handleBlur}
      >
        <Combobox.Control class="relative">
          <Combobox.Input
            placeholder={props.placeholder}
            class="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Combobox.Trigger class="absolute right-2 top-2">▼</Combobox.Trigger>
        </Combobox.Control>

        <Combobox.Positioner>
          <Combobox.Content class="bg-white border border-slate-200 shadow-lg rounded-md z-50">
            <For each={collection().items}>
              {(item) => (
                <Combobox.Item
                  item={item}
                  class="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                >
                  <Combobox.ItemText>{item}</Combobox.ItemText>
                </Combobox.Item>
              )}
            </For>
          </Combobox.Content>
        </Combobox.Positioner>
      </Combobox.Root>
    </FieldLayout>
  );
};
