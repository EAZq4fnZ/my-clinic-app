// src/ui/form/FormCheckboxField.tsx
import { Checkbox } from '@ark-ui/solid';
import { FieldLayout, type FieldLayoutProps } from '@ui/shared/FieldLayout';
import { splitProps } from 'solid-js';

export const FormCheckboxField = (
  props: Omit<FieldLayoutProps, 'children'>,
) => {
  const [local] = splitProps(props, ['label', 'field', 'helperText']);
  const getField = () =>
    typeof local.field === 'function' ? local.field() : local.field;

  return (
    <FieldLayout label="" field={getField()} helperText={local.helperText}>
      <Checkbox.Root
        checked={getField().state.value}
        onCheckedChange={(details) => getField().handleChange(details.checked)}
        class="flex items-center gap-2 cursor-pointer"
      >
        <Checkbox.Control class="w-5 h-5 border border-slate-300 rounded flex items-center justify-center data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600">
          <Checkbox.Indicator class="text-white text-xs">✓</Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.Label class="text-sm font-medium text-slate-700">
          {local.label}
        </Checkbox.Label>
        <Checkbox.HiddenInput />
      </Checkbox.Root>
    </FieldLayout>
  );
};
