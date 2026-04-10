import type { Component } from 'solid-js';
import { getAlertStatus, AlertStatus } from '@/utils/dateUtils';

interface Props {
  status: string | null | undefined;
  class?: string;
}

/**
 * 案件の進捗ステータスに応じた色付きバッジを表示する
 */
export const StatusBadge: Component<Props> = (props) => {
  // ステータス文字列に応じた色分けロジック
  const getColorClasses = () => {
    const s = props.status || '未設定';

    switch (s) {
      case '未請求':
        // 注意を促す黄色系
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case '請求済み':
        // 進行中の青系
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '承認待ち':
        // 確認待ちの紫系
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case '振込済み':
        // 完了を示す緑系
        return 'bg-green-100 text-green-800 border-green-200';
      case '中断':
        // 停止を示すグレー系
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        // その他・不明
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <span
      class={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border
        ${getColorClasses()}
        ${props.class || ''}
      `}
    >
      {props.status || '未設定'}
    </span>
  );
};
