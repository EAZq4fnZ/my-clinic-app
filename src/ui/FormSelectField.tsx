// @ui/FormSelectField.tsx
import { Select, createListCollection } from '@ark-ui/solid';
import { For, createMemo, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import { FieldLayout, type FieldLayoutProps } from '@ui/shared/FieldLayout';

// 選択肢の型定義
interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface Props extends FieldLayoutProps {
  options: SelectOption[];
  placeholder?: string;
}

export const FormSelectField = (props: Props) => {
  // local: このコンポーネントで使う制御用プロパティ
  // selectProps: 今後 Ark UI の Root に渡したくなるかもしれない拡張用（今回は未使用）
  const [local] = splitProps(props, [
    'label',
    'field',
    'helperText',
    'options',
    'placeholder',
  ]);

  // Ark UI 専用のコレクションを作成（メモ化してパフォーマンス最適化）
  const collection = createMemo(() =>
    createListCollection({ items: local.options }),
  );

  return (
    <FieldLayout
      label={local.label}
      field={local.field}
      helperText={local.helperText}
    >
      <Select.Root
        collection={collection()}
        // TanStack Form は単一の値を扱うため、配列に変換して渡す
        value={[local.field.state.value]}
        onValueChange={(details) => {
          // 選択された最初の値を Form に通知
          local.field.handleChange(details.value[0]);
        }}
        onExitComplete={() => local.field.handleBlur()}
        positioning={{ gutter: 4, sameWidth: true }}
      >
        <Select.Control>
          <Select.Trigger class="flex items-center justify-between w-full border border-slate-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50">
            <Select.ValueText
              placeholder={local.placeholder ?? '選択してください'}
            />
            <Select.Indicator>
              {/* シンプルな下矢印アイコン（SVG等でも可） */}
              <span class="text-xs text-slate-400">▼</span>
            </Select.Indicator>
          </Select.Trigger>
        </Select.Control>

        {/* メニュー部分はレイアウトを崩さないよう Portal で表示するのが一般的 */}
        <Portal>
          <Select.Positioner class="z-50">
            <Select.Content class="bg-white border border-slate-200 shadow-xl rounded-md min-w-[var(--reference-width)] p-1 animate-in fade-in zoom-in-95 duration-100">
              <For each={collection().items}>
                {(item) => (
                  <Select.Item
                    item={item}
                    class="flex items-center justify-between px-3 py-2 text-sm rounded-sm cursor-pointer hover:bg-slate-100 data-[disabled]:text-slate-300 data-[disabled]:cursor-not-allowed outline-none focus:bg-blue-50 focus:text-blue-700"
                  >
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator>✓</Select.ItemIndicator>
                  </Select.Item>
                )}
              </For>
            </Select.Content>
          </Select.Positioner>
        </Portal>

        {/* スクリーンリーダー・HTMLフォーム送信用の隠し要素 */}
        <Select.HiddenSelect name={local.field.name} />
      </Select.Root>
    </FieldLayout>
  );
};
