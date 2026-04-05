import { Badge } from '@/components/ui/Badge';
import { getAlertStatus } from '@/utils/dateUtils';
import { type Component, createMemo } from 'solid-js';

interface AlertBadgeProps {
  date: string | Date | null;
}

export const AlertBadge: Component<AlertBadgeProps> = (props) => {
  // getAlertStatusの結果に基づいて、見た目の設定（Config）を切り替える
  const config = createMemo(() => {
    const status = getAlertStatus(props.date);

    switch (status) {
      case 'critical':
        return {
          label: '1ヶ月経過',
          class: 'bg-red-100 text-red-700 border-red-200',
        };
      case 'warn':
        return {
          label: '3週間経過',
          class: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        };
      default:
        return {
          label: '継続中',
          class: 'bg-green-100 text-green-700 border-green-200',
        };
    }
  });

  return <Badge label={config().label} class={config().class} />;
};
