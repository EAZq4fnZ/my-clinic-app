// src/ui/form/FormComboBoxField.tsx
import { For, createEffect, createMemo, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import { FieldLayout, type FieldLayoutProps } from '@/ui/form/FieldLayout';
import { Combobox, createListCollection } from '@ark-ui/solid';

interface Item {
  label: string;
  value: string | number;
}

interface Props extends Omit<FieldLayoutProps, 'children'> {
  items: Item[];
  placeholder?: string;
  value?: string[];
  inputValue?: string;
  labelClass?: string; // ← 追加
  onValueChange?: (details: { value: string[] }) => void;
  onInputValueChange?: (details: { inputValue: string }) => void;
}

export const FormComboBoxField = (props: Props) => {
  const [local, rest] = splitProps(props, [
    'label',
    'field',
    'helperText',
    'items',
    'value',
    'inputValue',
    'labelClass',
    'onValueChange',
    'onInputValueChange',
  ]);

  const collection = createMemo(() =>
    createListCollection<Item>({
      items: local.items,
      itemToString: (item) => String(item.label),
      itemToValue: (item) => String(item.value),
    }),
  );

  createEffect(() => {
    const currentVal = local.value?.[0];
    if (currentVal) {
      const matchedItem = local.items.find(
        (i) => String(i.value) === String(currentVal),
      );
      if (matchedItem && matchedItem.label !== local.inputValue) {
        local.onInputValueChange?.({ inputValue: matchedItem.label });
      }
    }
  });

  return (
    <FieldLayout
      label={local.label}
      labelClass={local.labelClass} // ← FieldLayoutへ渡す
      field={local.field}
      helperText={local.helperText}
    >
      <Combobox.Root
        collection={collection()}
        value={local.value}
        inputValue={local.inputValue ?? ''}
        onValueChange={local.onValueChange}
        onInputValueChange={local.onInputValueChange}
        onExitComplete={() => local.field.handleBlur()}
        closeOnSelect
        {...rest}
      >
        <Combobox.Control class="relative w-full">
          <Combobox.Input
            placeholder={props.placeholder}
            class="w-full h-10 border border-slate-300 rounded-md px-3 pr-8 outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          />
          <Combobox.Trigger class="absolute right-2 top-0 h-full flex items-center text-slate-400 cursor-pointer z-10">
            <span class="text-[10px]">▼</span>
          </Combobox.Trigger>
        </Combobox.Control>
        <Portal>
          <Combobox.Positioner class="z-9999">
            <Combobox.Content class="bg-white border border-slate-200 shadow-xl rounded-md p-1 max-h-60 overflow-y-auto outline-none min-w-var(--reference-width)">
              <For each={collection().items}>
                {(item) => (
                  <Combobox.Item
                    item={item}
                    class="px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 cursor-pointer rounded flex justify-between items-center outline-none data-highlighted:bg-blue-50 data-selected:bg-blue-100"
                  >
                    <Combobox.ItemText>{item.label}</Combobox.ItemText>
                    <Combobox.ItemIndicator class="text-blue-600">
                      ✓
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                )}
              </For>
            </Combobox.Content>
          </Combobox.Positioner>
        </Portal>
      </Combobox.Root>
    </FieldLayout>
  );
};
