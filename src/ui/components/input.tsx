import { Field } from '@ark-ui/solid/field';
import { styled } from '@style/jsx';
import { input } from '@style/recipes';
import type { ComponentProps } from 'solid-js';

export type InputProps = ComponentProps<typeof Input>;
export const Input = styled(Field.Input, input);
