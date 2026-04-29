// src/ui/shared/FieldLayout.tsx
import { Fieldset } from '@ark-ui/solid';
import { css } from '@style/css';
import { stack } from '@style/patterns';
import { type ParentProps, Show, splitProps } from 'solid-js';

export interface FieldLayoutProps extends ParentProps {
  label?: string;
  helperText?: string;
  field?: any;
}

export const FieldLayout = (props: FieldLayoutProps) => {
  const [local] = splitProps(props, [
    'label',
    'helperText',
    'field',
    'children',
  ]);

  const f = () =>
    typeof local.field === 'function' ? local.field() : local.field;
  const errorMessages = () => f()?.state.meta.errors;
  const hasError = () => errorMessages()?.length > 0;

  return (
    <Fieldset.Root
      invalid={hasError()}
      class={stack({ gap: '1.5', width: 'full' })}
    >
      <Show when={local.label}>
        <Fieldset.Legend
          class={css({
            fontWeight: 'semibold',
            fontSize: 'sm',
            color: 'fg.default',
          })}
        >
          {local.label}
        </Fieldset.Legend>
      </Show>

      {local.children}

      <Fieldset.HelperText class={css({ fontSize: 'xs', color: 'fg.subtle' })}>
        <Show when={hasError()} fallback={local.helperText}>
          <span class={css({ color: 'error.default' })}>
            {errorMessages()?.[0]}
          </span>
        </Show>
      </Fieldset.HelperText>
    </Fieldset.Root>
  );
};
