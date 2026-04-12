// src/ui/EraDatePicker.tsx
import { DatePicker } from '@ark-ui/solid';
import {
  type CalendarDate,
  getLocalTimeZone,
  parseDate,
  today,
} from '@internationalized/date';
import { CalendarDays, X } from 'lucide-solid';
import { For, Show, createMemo } from 'solid-js';

import { getJapaneseEraYear } from '@/utils/dateUtils';

interface Props {
  value: string | null;
  onSelect: (val: string | null) => void;
  error?: string;
  label?: string;
  defaultViewYear?: number;
  startYear?: number;
  endYear?: number;
}

export const EraDatePicker = (props: Props) => {
  const yearOptions = createMemo(() => {
    const end = props.endYear || new Date().getFullYear();
    const start = props.startYear || 1930;
    return Array.from({ length: end - start + 1 }, (_, i) => end - i);
  });

  const transformedValue = createMemo(() => {
    if (!props.value) return [];
    try {
      return [parseDate(props.value)];
    } catch {
      return [];
    }
  });

  return (
    <DatePicker.Root
      value={transformedValue()}
      onValueChange={(details) =>
        props.onSelect(details.valueAsString[0] || null)
      }
      focusedValue={
        !props.value && props.defaultViewYear
          ? parseDate(`${props.defaultViewYear}-01-01`)
          : undefined
      }
      open={props.value ? undefined : false}
      positioning={{ gutter: 8 }}
    >
      <DatePicker.Context>
        {(api) => {
          // api().value は配列なので、最初の要素を取得
          const selectedDate = api().value[0] as CalendarDate | undefined;

          // 現在表示されている月の日数を計算（api().visibleRange を使用）
          const daysInMonth = createMemo(() => {
            const date = selectedDate || today(getLocalTimeZone());
            // CalendarDate のプロパティとしての情報を参照
            return date.calendar.getDaysInMonth(date);
          });

          const updatePart = (part: 'year' | 'month' | 'day', val: number) => {
            const current = selectedDate || today(getLocalTimeZone());
            let nextDate: CalendarDate;

            try {
              if (part === 'year') nextDate = current.set({ year: val });
              else if (part === 'month') nextDate = current.set({ month: val });
              else nextDate = current.set({ day: val });

              api().setValue([nextDate]);
            } catch {
              // 月末日の調整などが必要な場合のフォールバック
              if (part === 'month' || part === 'year') {
                const firstOfMonth = current.set({ [part]: val, day: 1 });
                const maxDays =
                  firstOfMonth.calendar.getDaysInMonth(firstOfMonth);
                nextDate = firstOfMonth.set({
                  day: Math.min(current.day, maxDays),
                });
                api().setValue([nextDate]);
              }
            }
          };

          return (
            <div class="flex flex-col gap-1 w-full">
              {props.label && (
                <label class="text-sm font-medium text-gray-700">
                  {props.label}
                </label>
              )}

              <div class="flex items-center gap-2">
                {/* 年 */}
                <select
                  value={selectedDate?.year ?? ''}
                  onChange={(e) =>
                    updatePart('year', Number(e.currentTarget.value))
                  }
                  class={`border rounded px-2 py-1.5 bg-white text-sm focus:ring-2 outline-none ${
                    props.error
                      ? 'border-red-500 ring-red-100'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="" disabled selected>
                    年
                  </option>
                  <For each={yearOptions()}>
                    {(y) => (
                      <option value={y}>
                        {y} ({getJapaneseEraYear(y)})
                      </option>
                    )}
                  </For>
                </select>

                {/* 月 */}
                <select
                  value={selectedDate?.month ?? ''}
                  onChange={(e) =>
                    updatePart('month', Number(e.currentTarget.value))
                  }
                  class="border border-gray-300 rounded px-2 py-1.5 bg-white text-sm outline-none"
                >
                  <option value="" disabled selected>
                    月
                  </option>
                  <For each={Array.from({ length: 12 }, (_, i) => i + 1)}>
                    {(m) => <option value={m}>{m}</option>}
                  </For>
                </select>

                {/* 日 */}
                <select
                  value={selectedDate?.day ?? ''}
                  onChange={(e) =>
                    updatePart('day', Number(e.currentTarget.value))
                  }
                  class="border border-gray-300 rounded px-2 py-1.5 bg-white text-sm outline-none"
                >
                  <option value="" disabled selected>
                    日
                  </option>
                  <For
                    each={Array.from(
                      { length: daysInMonth() },
                      (_, i) => i + 1,
                    )}
                  >
                    {(d) => <option value={d}>{d}</option>}
                  </For>
                </select>

                <DatePicker.Trigger class="p-2 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 cursor-pointer">
                  <CalendarDays size={18} class="text-gray-600" />
                </DatePicker.Trigger>

                <Show when={props.value}>
                  <button
                    type="button"
                    onClick={() => props.onSelect(null)}
                    class="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </Show>
              </div>

              <DatePicker.Positioner>
                <DatePicker.Content class="bg-white border rounded-xl shadow-2xl p-4 z-50">
                  <DatePicker.View view="day">
                    <DatePicker.Context>
                      {(viewApi) => (
                        <>
                          <div class="flex justify-between items-center mb-4 px-1">
                            <DatePicker.PrevTrigger class="p-1 hover:bg-gray-100 rounded cursor-pointer">
                              &lt;
                            </DatePicker.PrevTrigger>
                            <div class="font-bold flex flex-col items-center">
                              <DatePicker.ViewTrigger class="hover:text-blue-600 cursor-pointer">
                                <DatePicker.RangeText />
                              </DatePicker.ViewTrigger>
                              <span class="text-[10px] text-gray-500 font-normal">
                                (
                                {getJapaneseEraYear(
                                  viewApi().visibleRange.start.year,
                                )}
                                )
                              </span>
                            </div>
                            <DatePicker.NextTrigger class="p-1 hover:bg-gray-100 rounded cursor-pointer">
                              &gt;
                            </DatePicker.NextTrigger>
                          </div>

                          <DatePicker.Table class="text-xs border-separate border-spacing-1">
                            <DatePicker.TableHead>
                              <DatePicker.TableRow>
                                <For
                                  each={[
                                    '日',
                                    '月',
                                    '火',
                                    '水',
                                    '木',
                                    '金',
                                    '土',
                                  ]}
                                >
                                  {(day) => (
                                    <DatePicker.TableHeader class="p-1 text-gray-400 font-semibold w-9 text-center">
                                      {day}
                                    </DatePicker.TableHeader>
                                  )}
                                </For>
                              </DatePicker.TableRow>
                            </DatePicker.TableHead>
                            <DatePicker.TableBody>
                              <For each={viewApi().weeks}>
                                {(week) => (
                                  <DatePicker.TableRow>
                                    <For each={week}>
                                      {(day) => (
                                        <DatePicker.TableCell value={day}>
                                          <DatePicker.TableCellTrigger class="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-all data-[selected]:bg-blue-600 data-[selected]:text-white data-[outside-range]:text-gray-300 cursor-pointer">
                                            {day.day}
                                          </DatePicker.TableCellTrigger>
                                        </DatePicker.TableCell>
                                      )}
                                    </For>
                                  </DatePicker.TableRow>
                                )}
                              </For>
                            </DatePicker.TableBody>
                          </DatePicker.Table>
                        </>
                      )}
                    </DatePicker.Context>
                  </DatePicker.View>
                </DatePicker.Content>
              </DatePicker.Positioner>

              <Show when={props.error}>
                <span class="text-xs text-red-500 font-medium px-1 mt-0.5">
                  {props.error}
                </span>
              </Show>
            </div>
          );
        }}
      </DatePicker.Context>
    </DatePicker.Root>
  );
};
