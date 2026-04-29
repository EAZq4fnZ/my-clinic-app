import { qrCodeAnatomy } from '@ark-ui/solid/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const qrCode = defineSlotRecipe({
  className: 'qr-code',
  slots: qrCodeAnatomy.keys(),
  base: {},
});
