import { stepsAnatomy } from '@ark-ui/solid/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const steps = defineSlotRecipe({
  className: 'steps',
  slots: stepsAnatomy.keys(),
  base: {},
});
