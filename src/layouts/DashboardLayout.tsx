// src/routes/DashboardLayout.tsx
import type { JSX } from 'solid-js';

interface Props {
  children: JSX.Element;
  sidebar: JSX.Element;
  searchBar: JSX.Element;
  bottomNav: JSX.Element;
}

export const DashboardLayout = (props: Props) => {
  return (
    <div class="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* 1. サイドバー (デスクトップのみ表示) */}
      <aside class="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white">
        {props.sidebar}
      </aside>

      <div class="flex flex-1 flex-col overflow-hidden">
        {/* 2. トップ検索バー (固定) */}
        <header class="h-16 border-b border-slate-200 bg-white px-4 flex items-center shrink-0">
          <div class="max-w-3xl w-full mx-auto">{props.searchBar}</div>
        </header>

        {/* 3. メインコンテンツエリア (スクロール) */}
        <main class="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          <div class="max-w-7xl mx-auto">{props.children}</div>
        </main>
      </div>

      {/* 4. アンダーメニュー (モバイルのみ表示) */}
      <nav class="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-slate-200 bg-white px-6 flex items-center justify-around z-50">
        {props.bottomNav}
      </nav>
    </div>
  );
};
