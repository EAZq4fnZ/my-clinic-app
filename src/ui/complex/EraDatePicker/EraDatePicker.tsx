// src/ui/complex/EraDatePicker/EraDatePicker.tsx
import { Combobox, createListCollection } from '@ark-ui/solid';
import { For, createMemo, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import { FieldLayout, type FieldLayoutProps } from '@ui/shared/FieldLayout';
import {
  generateDayOptions,
  generateMonthOptions,
  generateYearOptions,
  parseDateString,
  serializeDate,
} from './inner-utils';

type EraDatePickerProps = Omit<FieldLayoutProps, 'children'>;

export const EraDatePicker = (props: EraDatePickerProps) => {
  const [local, rest] = splitProps(props, ['label', 'field', 'helperText']);

  const dateParts = createMemo(() => parseDateString(local.field.state.value));

  const yearOptions = createMemo(() => generateYearOptions());
  const monthOptions = createMemo(() => generateMonthOptions());
  const dayOptions = createMemo(() =>
    generateDayOptions(dateParts().year, dateParts().month),
  );

  const yearCollection = createMemo(() =>
    createListCollection({ items: yearOptions() }),
  );
  const monthCollection = createMemo(() =>
    createListCollection({ items: monthOptions() }),
  );
  const dayCollection = createMemo(() =>
    createListCollection({ items: dayOptions() }),
  );

  const handlePartChange = (
    part: 'year' | 'month' | 'day',
    newValue: string,
  ) => {
    const current = parseDateString(local.field.state.value);
    const next = {
      year: part === 'year' ? newValue : current.year,
      month: part === 'month' ? newValue : current.month,
      day: part === 'day' ? newValue : current.day,
    };

    if (!next.year && !next.month && !next.day) {
      local.field.handleChange('');
    } else {
      const formatted = serializeDate(next.year, next.month, next.day);
      if (formatted) {
        local.field.handleChange(formatted);
      }
    }
  };

  const inputBaseClass =
    'h-10 w-full border border-slate-300 rounded-md px-3 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50';

  return (
    <FieldLayout {...local}>
      <div class="flex gap-2 items-start">
        <div class="flex-[2]">
          <Combobox.Root
            collection={yearCollection()}
            value={dateParts().year ? [dateParts().year] : []}
            onValueChange={(d) => handlePartChange('year', d.value[0])}
            onExitComplete={() => local.field.handleBlur()}
          >
            <Combobox.Label class="sr-only">年</Combobox.Label>
            <Combobox.Control>
              <Combobox.Input class={inputBaseClass} placeholder="年 (西暦)" />
            </Combobox.Control>
            <Portal>
              <Combobox.Positioner class="z-[100]">
                <Combobox.Content class="bg-white border border-slate-200 shadow-xl rounded-md p-1 max-h-60 overflow-y-auto">
                  <For each={yearCollection().items}>
                    {(item) => (
                      <Combobox.Item
                        item={item}
                        class="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer rounded outline-none data-[highlighted]:bg-blue-50"
                      >
                        <Combobox.ItemText>{item.label}</Combobox.ItemText>
                      </Combobox.Item>
                    )}
                  </For>
                </Combobox.Content>
              </Combobox.Positioner>
            </Portal>
          </Combobox.Root>
        </div>

        <div class="flex-1">
          <Combobox.Root
            collection={monthCollection()}
            value={dateParts().month ? [dateParts().month] : []}
            onValueChange={(d) => handlePartChange('month', d.value[0])}
            onExitComplete={() => local.field.handleBlur()}
          >
            <Combobox.Label class="sr-only">月</Combobox.Label>
            <Combobox.Control>
              <Combobox.Input class={inputBaseClass} placeholder="月" />
            </Combobox.Control>
            <Portal>
              <Combobox.Positioner class="z-[100]">
                <Combobox.Content class="bg-white border border-slate-200 shadow-xl rounded-md p-1 max-h-60 overflow-y-auto">
                  <For each={monthCollection().items}>
                    {(item) => (
                      <Combobox.Item
                        item={item}
                        class="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer rounded outline-none data-[highlighted]:bg-blue-50"
                      >
                        <Combobox.ItemText>{item.label}</Combobox.ItemText>
                      </Combobox.Item>
                    )}
                  </For>
                </Combobox.Content>
              </Combobox.Positioner>
            </Portal>
          </Combobox.Root>
        </div>

        <div class="flex-1">
          <Combobox.Root
            collection={dayCollection()}
            value={dateParts().day ? [dateParts().day] : []}
            onValueChange={(d) => handlePartChange('day', d.value[0])}
            onExitComplete={() => local.field.handleBlur()}
          >
            <Combobox.Label class="sr-only">日</Combobox.Label>
            <Combobox.Control>
              <Combobox.Input class={inputBaseClass} placeholder="日" />
            </Combobox.Control>
            <Portal>
              <Combobox.Positioner class="z-[100]">
                <Combobox.Content class="bg-white border border-slate-200 shadow-xl rounded-md p-1 max-h-60 overflow-y-auto">
                  <For each={dayCollection().items}>
                    {(item) => (
                      <Combobox.Item
                        item={item}
                        class="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer rounded outline-none data-[highlighted]:bg-blue-50"
                      >
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
    </FieldLayout>
  );
};
