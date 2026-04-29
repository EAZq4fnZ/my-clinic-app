import { tourAnatomy } from '@ark-ui/solid/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const tour = defineSlotRecipe({
  className: 'tour',
  slots: tourAnatomy.keys(),
  base: {},
});
