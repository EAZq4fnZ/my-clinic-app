import { FieldLayout, type FieldLayoutProps } from '@/ui/form/FieldLayout';
// src/ui/form/FormSwitchField.tsx
import { Switch } from '@ark-ui/solid';
import { splitProps } from 'solid-js';

export const FormSwitchField = (props: Omit<FieldLayoutProps, 'children'>) => {
  const [local] = splitProps(props, ['label', 'field', 'helperText']);
  const getField = () =>
    typeof local.field === 'function' ? local.field() : local.field;

  return (
    <FieldLayout label="" field={getField()} helperText={local.helperText}>
      <Switch.Root
        checked={getField().state.value}
        onCheckedChange={(details) => getField().handleChange(details.checked)}
        class="flex items-center gap-3 cursor-pointer"
      >
        <Switch.Control class="w-10 h-6 bg-slate-200 rounded-full p-1 transition-colors data-[state=checked]:bg-blue-600">
          <Switch.Thumb class="w-4 h-4 bg-white rounded-full transition-transform data-[state=checked]:translate-x-4 shadow-sm" />
        </Switch.Control>
        <Switch.Label class="text-sm font-medium text-slate-700">
          {local.label}
        </Switch.Label>
        <Switch.HiddenInput />
      </Switch.Root>
    </FieldLayout>
  );
};
