import { floatingPanelAnatomy } from '@ark-ui/solid/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const floatingPanel = defineSlotRecipe({
  className: 'floating-panel',
  slots: floatingPanelAnatomy.keys(),
  base: {},
});
