//
import { ark } from '@ark-ui/solid/factory';
import { createStyleContext } from '@style/jsx';
import { alert } from '@style/recipes';
import { InfoIcon } from 'lucide-solid';
import type { ComponentProps } from 'solid-js';

const { withProvider, withContext } = createStyleContext(alert);

export type RootProps = ComponentProps<typeof Root>;
export const Root = withProvider(ark.div, 'root');
export const Title = withContext(ark.h3, 'title');
export const Description = withContext(ark.div, 'description');
export const Content = withContext(ark.div, 'content');

type IndicatorProps = ComponentProps<typeof StyledIndicator>;
const StyledIndicator = withContext(ark.span, 'indicator');

export const Indicator = (props: IndicatorProps) => {
  return (
    <StyledIndicator {...props}>
      <InfoIcon />
    </StyledIndicator>
  );
};
