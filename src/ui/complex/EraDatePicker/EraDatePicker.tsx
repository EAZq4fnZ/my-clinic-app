// src/ui/complex/EraDatePicker/EraDatePicker.tsx
import { Show, createMemo, createSignal, splitProps } from 'solid-js';

import {
  generateDayOptions,
  generateMonthOptions,
  generateYearOptions,
  parseDateString,
  serializeDate,
} from './inner-utils';
import { FormComboBoxField } from '@/ui/form/FormComboBoxField';
import type { FieldLayoutProps } from '@ui/shared/FieldLayout';

type EraDatePickerProps = Omit<FieldLayoutProps, 'children'>;

export const EraDatePicker = (props: EraDatePickerProps) => {
  const [local] = splitProps(props, ['label', 'field', 'helperText']);
  const f = () =>
    typeof local.field === 'function' ? local.field() : local.field;

  const dateParts = createMemo(() => {
    const val = f().state.value;
    return parseDateString(typeof val === 'string' ? val : '');
  });

  const [yearInput, setYearInput] = createSignal('');
  const [monthInput, setMonthInput] = createSignal('');
  const [dayInput, setDayInput] = createSignal('');

  const handlePartChange = (
    part: 'year' | 'month' | 'day',
    newValue: string,
  ) => {
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

  const yearOptions = createMemo(() => generateYearOptions(120));
  const monthOptions = createMemo(() => generateMonthOptions());
  const dayOptions = createMemo(() =>
    generateDayOptions(dateParts().year, dateParts().month),
  );

  // ラベルを透明にしつつ、高さをゼロにして隙間を埋める
  const invisibleLabelClass =
    'text-transparent select-none h-0 m-0 p-0 leading-[0] overflow-hidden';

  const getDisplayValue = (part: 'year' | 'month' | 'day') => {
    const val = dateParts()[part];
    const input =
      part === 'year'
        ? yearInput()
        : part === 'month'
          ? monthInput()
          : dayInput();
    if (input && !val) return input;
    const options =
      part === 'year'
        ? yearOptions()
        : part === 'month'
          ? monthOptions()
          : dayOptions();
    const matched = options.find((o) => o.value === val);
    return matched ? matched.label : input || val || '';
  };

  return (
    // fieldset のデフォルト枠線を完全に消去
    <fieldset class="flex flex-col gap-1 w-full border-0 p-0 m-0 min-w-0 appearance-none">
      {/* legend の枠線を消し、ラベルとして整える */}
      <legend class="text-sm font-semibold text-slate-700 mb-1 block p-0 border-none outline-none bg-transparent">
        {local.label}
      </legend>

      <div class="flex gap-2 items-start w-full">
        {/* 年: 幅広め */}
        <div class="min-w-0" style={{ flex: '2.5 1 0%' }}>
          <FormComboBoxField
            label="年"
            labelClass={invisibleLabelClass}
            field={f()}
            items={yearOptions()}
            placeholder="年"
            value={dateParts().year ? [dateParts().year] : []}
            inputValue={getDisplayValue('year')}
            onValueChange={(d) => {
              if (d.value[0]) {
                handlePartChange('year', d.value[0]);
                setYearInput('');
              }
            }}
            onInputValueChange={(d) => {
              setYearInput(d.inputValue);
              const digits = d.inputValue.match(/\d+/)?.[0];
              if (digits && digits.length === 4)
                handlePartChange('year', digits);
              else if (d.inputValue === '') handlePartChange('year', '');
            }}
          />
        </div>

        {/* 月: 短め */}
        <div class="min-w-0" style={{ flex: '1 1 0%' }}>
          <FormComboBoxField
            label="月"
            labelClass={invisibleLabelClass}
            field={f()}
            items={monthOptions()}
            placeholder="月"
            value={dateParts().month ? [dateParts().month] : []}
            inputValue={getDisplayValue('month')}
            onValueChange={(d) => {
              if (d.value[0]) {
                handlePartChange('month', d.value[0]);
                setMonthInput('');
              }
            }}
            onInputValueChange={(d) => {
              setMonthInput(d.inputValue);
              const digits = d.inputValue.match(/\d+/)?.[0];
              if (digits) handlePartChange('month', digits);
              else if (d.inputValue === '') handlePartChange('month', '');
            }}
          />
        </div>

        {/* 日: 短め */}
        <div class="min-w-0" style={{ flex: '1 1 0%' }}>
          <FormComboBoxField
            label="日"
            labelClass={invisibleLabelClass}
            field={f()}
            items={dayOptions()}
            placeholder="日"
            value={dateParts().day ? [dateParts().day] : []}
            inputValue={getDisplayValue('day')}
            onValueChange={(d) => {
              if (d.value[0]) {
                handlePartChange('day', d.value[0]);
                setDayInput('');
              }
            }}
            onInputValueChange={(d) => {
              setDayInput(d.inputValue);
              const digits = d.inputValue.match(/\d+/)?.[0];
              if (digits) handlePartChange('day', digits);
              else if (d.inputValue === '') handlePartChange('day', '');
            }}
          />
        </div>
      </div>

      <div class="mt-1 min-h-1.25rem">
        <Show
          when={f().state.meta.errors?.length}
          fallback={
            <Show when={local.helperText}>
              <span class="text-xs text-slate-500">{local.helperText}</span>
            </Show>
          }
        >
          <span class="text-xs text-red-500 font-medium">
            {f().state.meta.errors.join(', ')}
          </span>
        </Show>
      </div>
    </fieldset>
  );
};
