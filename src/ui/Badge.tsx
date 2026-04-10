import type { Component, JSX } from 'solid-js';

// Javaの引数（Constructor）に相当するProps定義
interface BadgeProps {
  label: string;
  class: string; // 色や枠線のCSSクラス
  icon?: JSX.Element;
}

/**
 * すべてのバッジの「土台」となるコンポーネント
 */
export const Badge: Component<BadgeProps> = (props) => {
  return (
    <span
      class={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${props.class}`}
    >
      {props.icon}
      {props.label}
    </span>
  );
};
