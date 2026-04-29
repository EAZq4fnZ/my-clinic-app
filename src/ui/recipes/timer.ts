import { timerAnatomy } from '@ark-ui/solid/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const timer = defineSlotRecipe({
  className: 'timer',
  slots: timerAnatomy.keys(),
  base: {},
});
