import { ark } from '@ark-ui/solid/factory';
import { styled } from '@style/jsx';
import { group } from '@style/recipes';
import type { ComponentProps } from 'solid-js';

export type GroupProps = ComponentProps<typeof Group>;
export const Group = styled(ark.div, group);
