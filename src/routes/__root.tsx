import type { QueryClient } from '@tanstack/solid-query';
import { SolidQueryDevtools } from '@tanstack/solid-query-devtools';
import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/solid-router';
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools';

// Routerで使用するコンテキストの型定義
interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div class="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* 共通ナビゲーションバー */}
      <nav class="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center space-x-8">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              class="text-xl font-bold text-blue-600"
            >
              Medical System
            </Link>
            <div class="flex space-x-4">
              <Link
                to="/"
                activeOptions={{ exact: true }}
                activeProps={{ class: 'text-blue-600 font-bold' }}
                class="text-gray-600 hover:text-blue-500 transition-colors"
              >
                ダッシュボード
              </Link>
              <Link
                to="/patient-form"
                activeProps={{ class: 'text-blue-600 font-bold' }}
                class="text-gray-600 hover:text-blue-500 transition-colors"
              >
                患者登録
              </Link>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
              User
            </div>
          </div>
        </div>
      </nav>

      {/* 各ルートのコンテンツがここに表示される */}
      <main class="py-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* 開発ツール */}
      <TanStackRouterDevtools position="bottom-right" />
      <SolidQueryDevtools buttonPosition="bottom-left" />
    </div>
  );
}
