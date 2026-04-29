//
import { ark } from '@ark-ui/solid/factory';
import { styled } from '@style/jsx';
import { spinner } from '@style/recipes';
import type { ComponentProps } from 'solid-js';

export type SpinnerProps = ComponentProps<typeof Spinner>;
export const Spinner = styled(ark.span, spinner);
