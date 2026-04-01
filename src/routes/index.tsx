import { Link, createFileRoute } from '@tanstack/solid-router';
import { For, Show } from 'solid-js';

// ダッシュボード用の簡易コンポーネント
const StatCard = (props: {
  title: string;
  value: string | number;
  icon: string;
}) => (
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500 uppercase">{props.title}</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{props.value}</p>
      </div>
      <span class="text-2xl">{props.icon}</span>
    </div>
  </div>
);

const Dashboard = () => {
  // 本来は各Serviceからデータを取得しますが、ここではデザイン用のサンプルを表示します
  const recentActivities = [
    { id: 1, type: '新規登録', patient: '山田 太郎', time: '10分前' },
    { id: 2, type: '情報更新', patient: '佐藤 花子', time: '1時間前' },
    { id: 3, type: '新規登録', patient: '鈴木 一郎', time: '3時間前' },
  ];

  return (
    <div class="p-6 max-w-7xl mx-auto">
      <header class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p class="text-gray-600">システムの概況と最近の活動を確認できます。</p>
      </header>

      {/* 統計セクション */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="総患者数" value="1,248" icon="👥" />
        <StatCard title="今月の新規登録" value="42" icon="📝" />
        <StatCard title="対応待ち案件" value="5" icon="⚠️" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* クイックアクション */}
        <section class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 class="text-lg font-semibold mb-4 border-b pb-2">
            クイックアクセス
          </h2>
          <div class="grid grid-cols-2 gap-4">
            <Link
              to="/patient-form"
              class="flex flex-col items-center justify-center p-4 rounded-md border border-blue-100 bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
            >
              <span class="text-2xl mb-1">➕</span>
              <span class="text-sm font-medium">患者新規登録</span>
            </Link>
            <Link
              to="/patients"
              class="flex flex-col items-center justify-center p-4 rounded-md border border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
            >
              <span class="text-2xl mb-1">🔍</span>
              <span class="text-sm font-medium">患者一覧検索</span>
            </Link>
          </div>
        </section>

        {/* 最近の活動ログ */}
        <section class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 class="text-lg font-semibold mb-4 border-b pb-2">最近の活動</h2>
          <div class="flow-root">
            <ul class="-my-5 divide-y divide-gray-200">
              <For each={recentActivities}>
                {(activity) => (
                  <li class="py-4">
                    <div class="flex items-center space-x-4">
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {activity.patient}
                        </p>
                        <p class="text-sm text-gray-500 truncate">
                          {activity.type}
                        </p>
                      </div>
                      <div class="inline-flex items-center text-xs text-gray-400">
                        {activity.time}
                      </div>
                    </div>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: Dashboard,
});
