// src/ui/form/EraDatePicker/EraDatePicker.tsx
import { Select, createListCollection } from '@ark-ui/solid';
import { css } from '@style/css';
import { flex } from '@style/patterns';
import { FieldLayout } from '@ui/form/FieldLayout';
import { ChevronDownIcon } from 'lucide-solid';
import { For, createMemo, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';
import {
  generateDayOptions,
  generateMonthOptions,
  generateYearOptions,
  parseDateString,
  serializeDate,
} from './inner-utils';

export const EraDatePicker = (props: any) => {
  const [local] = splitProps(props, ['label', 'field', 'helperText']);
  const f = () =>
    typeof local.field === 'function' ? local.field() : local.field;

  const dateParts = createMemo(() => {
    const val = f()?.state.value ?? '';
    return parseDateString(String(val));
  });

  const yearCollection = createMemo(() =>
    createListCollection({ items: generateYearOptions(120) }),
  );
  const monthCollection = createMemo(() =>
    createListCollection({ items: generateMonthOptions() }),
  );
  const dayCollection = createMemo(() => {
    const p = dateParts();
    return createListCollection({ items: generateDayOptions(p.year, p.month) });
  });

  const updateField = (part: 'year' | 'month' | 'day', newValue: string) => {
    const current = dateParts();
    const next = { ...current, [part]: newValue };
    f().handleChange(serializeDate(next.year, next.month, next.day));
  };

  // スタイルの修正
  const triggerStyle = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 'full',
    //  h: '15', // 高さを確保
    //  px: '5', // 水平方向のパディング
    //  bg: 'bg.default', // 背景色
    //  borderWidth: '1px', // 枠線の幅
    //  borderColor: 'border.default',  // 枠線の色
    borderRadius: 'l2', // 角丸
    cursor: 'pointer', // カーソルをポインターに
    fontSize: 'sm', // フォントサイズ
    lineHeight: '1', // ラインハイトを詰めて中央寄せしやすくする
    _hover: { borderColor: 'border.accent' }, // ホバー時のスタイル
    _focus: { borderColor: 'border.accent', boxShadow: 'accent' }, // フォーカス時のスタイル
  });

  const valueTextStyle = css({
    flex: '1', //
    textAlign: 'left', // テキストを左寄せ
    overflow: 'hidden', //  テキストが溢れたときに隠す
    textOverflow: 'ellipsis', // テキストが溢れたときに省略記号を表示
    whiteSpace: 'nowrap', // テキストを1行にする
    minWidth: 0, //　親の幅いっぱいに広げるために必要
    display: 'flex', // フレックスコンテナにして
    alignItems: 'center', // 垂直方向中央寄せ
    h: 'full', // 親の Trigger いっぱいに広げる
  });

  return (
    <FieldLayout
      label={local.label}
      field={local.field}
      helperText={local.helperText}
    >
      <div class={flex({ gap: '1', width: 'full', alignItems: 'center' })}>
        <For
          each={
            [
              { key: 'year', col: yearCollection, flex: '2.8', ph: '年' },
              { key: 'month', col: monthCollection, flex: '1.2', ph: '月' },
              { key: 'day', col: dayCollection, flex: '1.2', ph: '日' },
            ] as const
          }
        >
          {(item) => (
            <div class={css({ flex: `${item.flex} 1 0%`, minWidth: 0 })}>
              <Select.Root
                positioning={{ sameWidth: true }}
                value={[dateParts()[item.key]]}
                onValueChange={(d) => updateField(item.key, d.value[0])}
                collection={item.col()}
              >
                <Select.Control>
                  <Select.Trigger class={triggerStyle}>
                    <Select.ValueText
                      placeholder={item.ph}
                      class={css({
                        truncate: true,
                        textAlign: 'left',
                        flex: 1,
                        lineHeight: 'normal',
                      })}
                    />
                    <Select.Indicator>
                      <ChevronDownIcon
                        size={14}
                        class={css({ color: 'fg.muted', ml: '1' })}
                      />
                    </Select.Indicator>
                  </Select.Trigger>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content
                      class={css({
                        bg: 'bg.default',
                        boxShadow: 'lg', // ドロップシャドウ
                        borderRadius: 'l2', // 角丸
                        p: '1', // パディング
                        zIndex: 'dropdown', // ドロップダウンの上に表示
                        maxH: '200', // 最大高さを設定してスクロール可能に
                        overflowY: 'auto', // アイテムが多い場合にスクロールできるように
                      })}
                    >
                      <For each={item.col().items}>
                        {(option) => (
                          <Select.Item
                            item={option}
                            class={css({
                              px: '2',
                              py: '1.5',
                              fontSize: 'xs', // フォントサイズ
                              borderRadius: 'l1', // 角丸
                              cursor: 'pointer', // カーソルをポインターに
                              _hover: { bg: 'bg.subtle' }, // ホバー時の背景色
                              _selected: {
                                fontWeight: 'bold', //  選択されたアイテムを太字に
                                color: 'accent.fg', // 選択されたアイテムの文字色
                                bg: 'accent.default', // 選択されたアイテムの背景色
                              },
                            })}
                          >
                            <Select.ItemText>{option.label}</Select.ItemText>
                          </Select.Item>
                        )}
                      </For>
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </div>
          )}
        </For>
      </div>
    </FieldLayout>
  );
};
