import { Combobox, createListCollection } from '@ark-ui/solid';
import { For, Show, createMemo, createSignal, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import { css } from '../../../../styled-system/css';
import { flex } from '../../../../styled-system/patterns';
import { props as formProps } from '../factory';
import {
  generateDayOptions,
  generateMonthOptions,
  generateYearOptions,
  parseDateString,
  serializeDate,
} from './inner-utils';

export const EraDatePicker = (props: any) => {
  // 1. Propsの分離 (既存の FieldLayoutProps 的な設計を継承)
  const [local] = splitProps(props, ['label', 'field', 'helperText']);

  // TanStack Form の field インスタンスへのアクセサ
  const f = () =>
    typeof local.field === 'function' ? local.field() : local.field;

  // 2. 内部ステート・メモ (既存の inner-utils ロジック)
  const dateParts = createMemo(() => {
    const val = f().state.value;
    return parseDateString(typeof val === 'string' ? val : '');
  });

  // 選択肢の生成
  const yearOptionsRaw = createMemo(() => generateYearOptions(120));
  const monthOptionsRaw = createMemo(() => generateMonthOptions());
  const dayOptionsRaw = createMemo(() =>
    generateDayOptions(dateParts().year, dateParts().month),
  );

  // Ark UI (Park UI) 用の Collection 変換
  const yearCollection = createMemo(() =>
    createListCollection({ items: yearOptionsRaw() }),
  );
  const monthCollection = createMemo(() =>
    createListCollection({ items: monthOptionsRaw() }),
  );
  const dayCollection = createMemo(() =>
    createListCollection({ items: dayOptionsRaw() }),
  );

  // 3. ハンドラ (既存ロジックを継承)
  const handlePartChange = (
    part: 'year' | 'month' | 'day',
    newValue: string | undefined,
  ) => {
    if (newValue === undefined) return;

    const current = dateParts();
    const next = {
      year: part === 'year' ? newValue : current.year,
      month: part === 'month' ? newValue : current.month,
      day: part === 'day' ? newValue : current.day,
    };

    if (!next.year && !next.month && !next.day) {
      f().handleChange('');
    } else {
      const formatted = serializeDate(next.year, next.month, next.day);
      if (formatted) f().handleChange(formatted);
    }
  };

  // 4. UI プリセットの取得 (props.preset.eraDate)
  const config = formProps.preset.eraDate;

  return (
    <fieldset
      class={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '1',
        w: 'full',
        border: 'none',
        p: '0',
        m: '0',
      })}
    >
      <legend
        class={css({
          fontSize: 'sm',
          fontWeight: 'semibold',
          color: 'fg.default',
          mb: '1',
        })}
      >
        {local.label}
      </legend>

      <div class={flex({ gap: '2', alignItems: 'flex-start', width: 'full' })}>
        {/* --- 年 (Year) --- */}
        <div class={css({ flex: '2.5 1 0%', minW: '0' })}>
          <Combobox.Root
            {...config.year.root}
            collection={yearCollection()}
            value={[dateParts().year]}
            onValueChange={(d) => handlePartChange('year', d.value[0])}
          >
            <Combobox.Control {...config.year.control}>
              <Combobox.Input {...config.year.input} />
            </Combobox.Control>
            <Portal>
              <Combobox.Positioner>
                <Combobox.Content {...config.year.content}>
                  <For each={yearCollection().items}>
                    {(item) => (
                      <Combobox.Item item={item} {...config.year.item}>
                        <Combobox.ItemText>{item.label}</Combobox.ItemText>
                      </Combobox.Item>
                    )}
                  </For>
                </Combobox.Content>
              </Combobox.Positioner>
            </Portal>
          </Combobox.Root>
        </div>

        {/* --- 月 (Month) --- */}
        <div class={css({ flex: '1 1 0%', minW: '0' })}>
          <Combobox.Root
            {...config.month.root}
            collection={monthCollection()}
            value={[dateParts().month]}
            onValueChange={(d) => handlePartChange('month', d.value[0])}
          >
            <Combobox.Control {...config.month.control}>
              <Combobox.Input {...config.month.input} />
            </Combobox.Control>
            <Portal>
              <Combobox.Positioner>
                <Combobox.Content {...config.month.content}>
                  <For each={monthCollection().items}>
                    {(item) => (
                      <Combobox.Item item={item} {...config.month.item}>
                        <Combobox.ItemText>{item.label}</Combobox.ItemText>
                      </Combobox.Item>
                    )}
                  </For>
                </Combobox.Content>
              </Combobox.Positioner>
            </Portal>
          </Combobox.Root>
        </div>

        {/* --- 日 (Day) --- */}
        <div class={css({ flex: '1 1 0%', minW: '0' })}>
          <Combobox.Root
            {...config.day.root}
            collection={dayCollection()}
            value={[dateParts().day]}
            onValueChange={(d) => handlePartChange('day', d.value[0])}
          >
            <Combobox.Control {...config.day.control}>
              <Combobox.Input {...config.day.input} />
            </Combobox.Control>
            <Portal>
              <Combobox.Positioner>
                <Combobox.Content {...config.day.content}>
                  <For each={dayCollection().items}>
                    {(item) => (
                      <Combobox.Item item={item} {...config.day.item}>
                        <Combobox.ItemText>{item.label}</Combobox.ItemText>
                      </Combobox.Item>
                    )}
                  </For>
                </Combobox.Content>
              </Combobox.Positioner>
            </Portal>
          </Combobox.Root>
        </div>
      </div>

      {/* エラーメッセージ & ヘルパーテキスト */}
      <div class={css({ mt: '1', minH: '5' })}>
        <Show
          when={f().state.meta.errors?.length}
          fallback={
            <Show when={local.helperText}>
              <span class={css({ fontSize: 'xs', color: 'fg.subtle' })}>
                {local.helperText}
              </span>
            </Show>
          }
        >
          <span
            class={css({
              fontSize: 'xs',
              color: 'error.default',
              fontWeight: 'medium',
            })}
          >
            {f().state.meta.errors.join(', ')}
          </span>
        </Show>
      </div>
    </fieldset>
  );
};
