import { Field } from '@ark-ui/solid/field';
import { styled } from '@style/jsx';
import { textarea } from '@style/recipes';
import type { ComponentProps } from 'solid-js';

export type TextareaProps = ComponentProps<typeof Textarea>;
export const Textarea = styled(Field.Textarea, textarea);
