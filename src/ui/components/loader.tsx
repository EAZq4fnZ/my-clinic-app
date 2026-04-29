import { styled } from '@style/jsx';
import { type ComponentProps, type JSX, Show, splitProps } from 'solid-js';

export interface LoaderProps extends ComponentProps<'svg'> {
  text?: JSX.Element;
  spinner?: JSX.Element;
  spinnerPlacement?: 'start' | 'end';
}

export const Loader = (props: LoaderProps) => {
  const [local, rest] = splitProps(props, [
    'text',
    'spinner',
    'spinnerPlacement',
    'children',
  ]);

  const spinner = (
    <Show
      when={local.spinner}
      fallback={
        /* 解決策: 
           styled.svg を使わず、通常の svg タグを使用します。
           スタイルの適用（アニメーションやサイズ）は styled.span で包んで行います。
        */
        <styled.span
          display="inline-flex"
          width="1em"
          height="1em"
          animation="spin 1s linear infinite"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            width="100%"
            height="100%"
            {...(rest as any)} // SVG属性の型競合を強制回避
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </styled.span>
      }
    >
      {local.spinner}
    </Show>
  );

  return (
    <styled.span display="inline-flex" alignItems="center" gap="2">
      <Show when={local.spinnerPlacement === 'start'}>{spinner}</Show>
      <Show when={local.text} fallback={local.children}>
        {local.text}
      </Show>
      <Show when={local.spinnerPlacement === 'end'}>{spinner}</Show>
    </styled.span>
  );
};
