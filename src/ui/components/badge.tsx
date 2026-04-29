//
import { ark } from '@ark-ui/solid/factory';
import { styled } from '@style/jsx';
import { badge } from '@style/recipes';
import type { ComponentProps } from 'solid-js';

export type BadgeProps = ComponentProps<typeof Badge>;
export const Badge = styled(ark.div, badge);
