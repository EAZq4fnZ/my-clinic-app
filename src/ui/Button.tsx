import { type Component, type JSX, splitProps } from 'solid-js';

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

/**
 * アプリ共通のボタンコンポーネント
 */
export const Button: Component<ButtonProps> = (props) => {
  // 標準のbutton属性と、カスタム属性(variant, size, isLoading, children)を分ける
  const [local, others] = splitProps(props, [
    'variant',
    'size',
    'isLoading',
    'children',
    'class',
  ]);

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      {...others}
      class={`
        inline-flex items-center justify-center rounded-lg font-medium transition-all
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]
        ${variantClasses[local.variant || 'primary']}
        ${sizeClasses[local.size || 'md']}
        ${local.class || ''}
      `}
    >
      {local.isLoading ? (
        <span class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
              fill="none"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          読み込み中...
        </span>
      ) : (
        local.children
      )}
    </button>
  );
};
