// @routes/index.tsx
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { useNavigate } from '@tanstack/solid-router';
import { type Component, For, Show, createResource } from 'solid-js';

// 患者データの簡易サマリーを取得する関数
const fetchDashboardStats = async () => {
  const { count, error } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return { totalPatients: count || 0 };
};

const DashboardPage: Component = () => {
  const navigate = useNavigate();
  const [stats] = createResource(fetchDashboardStats);

  return (
    <div class="max-w-6xl mx-auto py-10 px-6">
      <header class="flex items-end justify-between mb-10">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">ダッシュボード</h1>
          <p class="text-gray-500 mt-2">
            患者管理システムの概要を確認できます。
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate({ to: '/patients/new' })}
          class="shadow-lg shadow-blue-100"
        >
          ＋ 患者新規登録
        </Button>
      </header>

      {/* 統計カード */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p class="text-sm font-medium text-gray-500 mb-1">登録患者数</p>
          <Show
            when={!stats.loading}
            fallback={
              <div class="h-9 w-16 bg-gray-100 animate-pulse rounded" />
            }
          >
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-bold text-gray-900">
                {stats()?.totalPatients}
              </span>
              <span class="text-gray-400 text-sm font-normal">名</span>
            </div>
          </Show>
        </div>

        {/* 必要に応じて他の統計カードを追加 */}
        <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
          <div class="relative z-10">
            <p class="text-sm font-medium text-blue-600 mb-1">
              本日の予約（予定）
            </p>
            <span class="text-4xl font-bold text-blue-900">--</span>
          </div>
          <div class="absolute right-[-10px] bottom-[-10px] text-blue-200/50">
            <svg
              width="100"
              height="100"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c0 1.1.9-2 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* クイックリンク */}
      <section>
        <h2 class="text-lg font-bold text-gray-800 mb-4">クイックアクセス</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate({ to: '/patients' })}
            class="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-transparent hover:border-gray-200"
          >
            <p class="font-bold text-gray-700">患者一覧</p>
            <p class="text-xs text-gray-500 mt-1">登録済みデータの閲覧・編集</p>
          </button>

          <button
            onClick={() => navigate({ to: '/patients/new' })}
            class="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-transparent hover:border-gray-200"
          >
            <p class="font-bold text-gray-700">新規登録</p>
            <p class="text-xs text-gray-500 mt-1">新しい患者情報の追加</p>
          </button>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
