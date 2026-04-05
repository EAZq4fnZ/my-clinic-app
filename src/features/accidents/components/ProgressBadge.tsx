import { Badge } from '@/components/ui/Badge';
import { type Component, createMemo } from 'solid-js';

// DB上のステータス型定義
type ProgressStatus = 'initial' | 'negotiating' | 'closed';

interface ProgressBadgeProps {
  status: ProgressStatus;
}

export const ProgressBadge: Component<ProgressBadgeProps> = (props) => {
  const config = createMemo(() => {
    switch (props.status) {
      case 'initial':
        return {
          label: '受任前',
          color: 'bg-gray-100 text-gray-600 border-gray-200',
        };
      case 'negotiating':
        return {
          label: '交渉中',
          color: 'bg-blue-100 text-blue-700 border-blue-200',
        };
      case 'closed':
        return {
          label: '完了',
          color: 'bg-purple-100 text-purple-700 border-purple-200',
        };
      default:
        return {
          label: '不明',
          color: 'bg-gray-50 text-gray-400 border-gray-100',
        };
    }
  });

  return <Badge label={config().label} class={config().color} />;
};
