//
import { ark } from '@ark-ui/solid/factory';
import { styled } from '@style/jsx';
import { icon } from '@style/recipes';
import type { ComponentProps } from 'solid-js';

export type IconProps = ComponentProps<typeof Icon>;
export const Icon = styled(ark.svg, icon);
