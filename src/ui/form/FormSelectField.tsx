import { FieldLayout, type FieldLayoutProps } from '@/ui/form/FieldLayout';
// src/ui/form/FormSelectField.tsx
import { Select, createListCollection } from '@ark-ui/solid';
import { For, createMemo, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

// Option 型を定義（label と value を持つオブジェクト）
type Option = { label: string; value: string | number };
// FormSelectField の Props 定義
interface FormSelectProps extends Omit<FieldLayoutProps, 'children'> {
  options: Option[];
  placeholder?: string;
}

export const FormSelectField = (props: FormSelectProps) => {
  // 1. レイアウト用のプロパティ(local)と、Selectコンポーネントにそのまま渡すプロパティ(rest)に分ける
  const [local, rest] = splitProps(props, [
    'label',
    'field',
    'helperText',
    'options',
  ]);
  // 2. options 配列を Ark UI のコレクション形式に変換するための createListCollection を useMemo で作成
  const collection = createMemo(() =>
    // ジェネリクス <Option> を明示的に指定
    createListCollection<Option>({
      items: local.options,
      itemToString: (item) => String(item.label),
      // 内部型定義との一致のため、ここも String 化して一貫性を持たせる
      itemToValue: (item) => String(item.value),
    }),
  );
  // 3. 現在の選択値を文字列の配列として返す関数。Selectコンポーネントは常に配列で値を扱うため、ここで変換する
  const selectedValue = () => {
    const val = local.field.state.value;
    if (val === undefined || val === null || val === '') return [];
    return [String(val)];
  };
  // 4. レイアウトコンポーネントである FieldLayout を使用して、Selectコンポーネントを配置
  return (
    // FieldLayout に label, field, helperText を渡す
    <FieldLayout
      label={local.label}
      field={local.field}
      helperText={local.helperText}
    >
      {/* Select.Root に collection, value, onValueChange, onExitComplete を渡す */}
      <Select.Root
        collection={collection()}
        value={selectedValue()}
        onValueChange={(details) => {
          // TanStack Form 側には元の型（数値等）で戻したい場合はここでパース
          const nextValue = details.value[0];
          local.field.handleChange(nextValue);
        }}
        onExitComplete={() => local.field.handleBlur()}
        {...rest}
      >
        {/* Select.Control */}
        <Select.Control>
          {/* Select.Trigger 内に Select.ValueText を配置して、選択された値を表示 */}
          <Select.Trigger class="h-10 w-full border border-slate-300 rounded-md px-3 bg-white text-sm flex items-center justify-between outline-none focus:ring-2 focus:ring-blue-500">
            <Select.ValueText
              placeholder={props.placeholder ?? '選択してください'}
            />
          </Select.Trigger>
        </Select.Control>
        {/* ドロップダウンメニューは Portal を使ってルートに配置 */}
        <Portal>
          {/* Select.Positioner 内に Select.Content を配置し、options を For でループして表示 */}
          <Select.Positioner class="z-[100]">
            <Select.Content class="bg-white border border-slate-200 shadow-lg rounded-md p-1">
              <For each={collection().items}>
                {(item) => (
                  <Select.Item
                    item={item} // ← アイテムオブジェクト全体を渡す
                    class="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer rounded data-[selected]:bg-blue-50 data-[selected]:text-blue-600 outline-none"
                  >
                    <Select.ItemText>{item.label}</Select.ItemText>{' '}
                    {/* ← アイテムのラベルを表示 */}
                  </Select.Item>
                )}
              </For>
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </FieldLayout>
  );
};
