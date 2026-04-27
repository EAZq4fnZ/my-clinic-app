// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { RouterProvider, createRouter } from '@tanstack/solid-router';
import { render } from 'solid-js/web';
import './index.css';

//
import { routeTree } from './routeTree.gen';

// 1. QueryClient の作成
const queryClient = new QueryClient();

// 2. ルーターの作成
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
});

// 3. TanStack Router の型定義を登録（これにより router インスタンスが型安全になります）
declare module '@tanstack/solid-router' {
  interface Register {
    router: typeof router;
  }
}

// 4. アプリケーションのレンダリング
const rootElement = document.getElementById('root');

if (rootElement) {
  render(
    () => (
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    ),
    rootElement,
  );
}
