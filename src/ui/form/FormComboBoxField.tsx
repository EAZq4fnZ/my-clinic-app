// src/ui/form/FormComboBoxField.tsx
import { Combobox, createListCollection } from '@ark-ui/solid';
import { For, createMemo, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import { FieldLayout, type FieldLayoutProps } from '@ui/shared/FieldLayout';
// Option 型を定義（label と value を持つオブジェクト）
interface Item {
  label: string;
  value: string | number;
}
// FormComboBoxField の Props 定義
interface Props extends Omit<FieldLayoutProps, 'children'> {
  items: Item[];
  placeholder?: string;
}
// FormComboBoxField コンポーネントの実装
export const FormComboBoxField = (props: Props) => {
  // 1. レイアウト用のプロパティ(local)と、Comboboxコンポーネントにそのまま渡すプロパティ(rest)に分ける
  const [local, rest] = splitProps(props, [
    'label',
    'field',
    'helperText',
    'items',
  ]);

  // 2. items 配列を Ark UI のコレクション形式に変換するための createListCollection を useMemo で作成
  const collection = createMemo(() =>
    // 3. itemToString と itemToValue で、Ark UI の内部型 (string) に合わせるため String() でラップして一貫性を持たせる
    createListCollection<Item>({
      items: local.items,
      // Ark UI の内部型 (string) に合わせるため String() でラップ
      itemToString: (item) => String(item.label),
      itemToValue: (item) => String(item.value),
    }),
  );

  // 4. 現在の選択値を文字列の配列として返す関数。Comboboxコンポーネントは常に配列で値を扱うため、ここで変換する
  const selectedValue = (): string[] => {
    const val = local.field.state.value;
    if (val === undefined || val === null || val === '') return [];
    return [String(val)];
  };
  // 5. レイアウトコンポーネントである FieldLayout を使用して、Comboboxコンポーネントを配置
  return (
    // FieldLayout に label, field, helperText を渡す
    <FieldLayout
      label={local.label}
      field={local.field}
      helperText={local.helperText}
    >
      {/* Combobox.Root に collection, value, onValueChange, onExitComplete を渡す */}
      <Combobox.Root
        collection={collection()}
        value={selectedValue()}
        onValueChange={(details) => {
          const nextValue = details.value[0];
          // TanStack Form への通知
          local.field.handleChange(nextValue);
        }}
        onExitComplete={() => local.field.handleBlur()}
        {...rest}
      >
        <Combobox.Control class="relative">
          <Combobox.Input
            placeholder={props.placeholder}
            class="w-full h-10 border border-slate-300 rounded-md px-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          />
          <Combobox.Trigger class="absolute right-2 top-2.5 text-slate-400 text-xs cursor-pointer bg-transparent border-none">
            ▼
          </Combobox.Trigger>
        </Combobox.Control>
        {/* ドロップダウンメニューは Portal を使ってルートに配置 */}
        <Portal>
          <Combobox.Positioner class="z-[100]">
            <Combobox.Content class="bg-white border border-slate-200 shadow-xl rounded-md p-1 max-h-60 overflow-y-auto outline-none">
              <For each={collection().items}>
                {(item) => (
                  <Combobox.Item
                    item={item}
                    class="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer rounded outline-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 data-[disabled]:opacity-50"
                  >
                    <Combobox.ItemText>{item.label}</Combobox.ItemText>
                    <Combobox.ItemIndicator>✓</Combobox.ItemIndicator>
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
