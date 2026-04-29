import { defineConfig } from '@pandacss/dev';
import parkPreset from '@park-ui/presets';
import * as parkRecipes from './src/ui/recipes';

export default defineConfig({
  preflight: true,
  presets: ['@pandacss/preset-base', parkPreset],
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  jsxFramework: 'solid',
  outdir: 'styled-system',

  theme: {
    extend: {
      // 1. レシピの登録
      recipes: { ...parkRecipes.recipes },
      slotRecipes: { ...parkRecipes.slotRecipes },

      // 2. 実体（Tokens）の定義：これが抜けていると「Missing token」警告が出ます
      tokens: {
        colors: {
          neutral: {
            '1': { value: '#fcfcfc' },
            '2': { value: '#f9f9f9' },
            '3': { value: '#f0f0f0' },
            '4': { value: '#e8e8e8' },
            '5': { value: '#e0e0e0' },
            '6': { value: '#d9d9d9' },
            '7': { value: '#cecece' },
            '8': { value: '#bbbbbb' },
            '9': { value: '#8d8d8d' },
            '10': { value: '#838383' },
            '11': { value: '#646464' },
            '12': { value: '#202020' },
          },
        },
        radii: {
          xs: { value: '0.125rem' },
          sm: { value: '0.25rem' },
          md: { value: '0.375rem' },
          lg: { value: '0.5rem' },
          xl: { value: '0.75rem' },
        },
      },

      // 3. 役割（Semantic Tokens）の定義
      semanticTokens: {
        radii: {
          l1: { value: '{radii.xs}' },
          l2: { value: '{radii.sm}' },
          l3: { value: '{radii.md}' },
        },
        colors: {
          bg: {
            canvas: { value: '{colors.neutral.1}' },
            default: { value: '{colors.neutral.2}' },
            subtle: { value: '{colors.neutral.3}' },
            muted: { value: '{colors.neutral.4}' },
          },
          fg: {
            default: { value: '{colors.neutral.12}' },
            muted: { value: '{colors.neutral.11}' },
            subtle: { value: '{colors.neutral.10}' },
          },
          border: {
            default: { value: '{colors.neutral.6}' },
            muted: { value: '{colors.neutral.5}' },
          },
          gray: {
            '1': { value: '{colors.neutral.1}' },
            '2': { value: '{colors.neutral.2}' },
            '3': { value: '{colors.neutral.3}' },
            '4': { value: '{colors.neutral.4}' },
            '5': { value: '{colors.neutral.5}' },
            '6': { value: '{colors.neutral.6}' },
            '7': { value: '{colors.neutral.7}' },
            '8': { value: '{colors.neutral.8}' },
            '9': { value: '{colors.neutral.9}' },
            '10': { value: '{colors.neutral.10}' },
            '11': { value: '{colors.neutral.11}' },
            '12': { value: '{colors.neutral.12}' },
          },
        },
      },
    },
  },
});
