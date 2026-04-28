import { css } from '../../../../styled-system/css';
import { createPartsFactory } from '../../shared';

// フォーム全体の共通スタイル
const commonInputStyles = css({
  appearance: 'none',
  background: 'bg.default',
  borderColor: 'border.default',
  borderRadius: 'l2',
  borderWidth: '1px',
  outline: 'none',
  width: 'full',
  transitionDuration: 'normal',
  transitionProperty: 'box-shadow, border-color',
  _focus: {
    borderColor: 'border.accent',
    boxShadow: 'accent',
  },
});

// Combobox用ファクトリ
const comboFactory = createPartsFactory({
  root: { autoFocus: false, placeholder: '' },
  control: { class: css({ display: 'flex', position: 'relative' }) },
  input: { class: commonInputStyles },
  content: {
    class: css({
      bg: 'bg.default',
      boxShadow: 'lg',
      borderRadius: 'l2',
      zIndex: 'dropdown',
      p: '1',
    }),
  },
  item: {
    class: css({
      cursor: 'pointer',
      borderRadius: 'l1',
      px: '2',
      py: '1.5',
      _hover: { bg: 'bg.subtle' },
      _highlighted: { bg: 'bg.subtle' },
    }),
  },
});

export const props = {
  preset: {
    eraDate: {
      year: comboFactory({ root: { placeholder: '年' } }),
      month: comboFactory({ root: { placeholder: '月' } }),
      day: comboFactory({ root: { placeholder: '日' } }),
    },
  },
};
