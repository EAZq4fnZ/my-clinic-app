// src/components/layout/DashboardSidebar.tsx
import { For } from 'solid-js';

import { EraDatePicker } from '@ui/complex/EraDatePicker/EraDatePicker';
import { FormInputField } from '@ui/form/FormInputField';
import { FormSelectField } from '@ui/form/FormSelectField';

export const DashboardSidebar = (props: {
  onSearch: (values: any) => void;
  searchField: any; // TanStack Form の field
}) => {
  return (
    <div class="flex flex-col h-full p-4 gap-6">
      {/* 1. ロゴ・タイトル部分 */}
      <div class="px-2 py-4 border-b border-slate-100">
        <h1 class="text-xl font-bold text-slate-800">Case Manager</h1>
      </div>

      {/* 2. メインナビゲーション */}
      <nav class="flex flex-col gap-1">
        <a
          href="#"
          class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg"
        >
          <span>🏠</span> ダッシュボード
        </a>
        <a
          href="#"
          class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <span>📋</span> 案件一覧
        </a>
      </nav>

      {/* 3. 検索・フィルターセクション (ここが機能の核) */}
      <div class="flex flex-col gap-4 pt-4 border-t border-slate-100">
        <h2 class="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          詳細フィルター
        </h2>

        {/* キーワード検索 */}
        <FormInputField
          label="フリーワード"
          field={props.searchField}
          placeholder="名前、IDなど..."
        />

        {/* 以前作成した和暦ピッカーをここに配置 */}
        <EraDatePicker
          label="対象年月日"
          field={props.searchField} // 実際は検索用の別fieldを指定
          helperText="事故日や受診日で検索"
        />

        {/* ステータス選択 */}
        <FormSelectField
          label="現在の状態"
          field={props.searchField}
          options={[
            { label: 'すべて', value: 'all' },
            { label: '対応中', value: 'active' },
            { label: '完了', value: 'completed' },
          ]}
        />
      </div>

      {/* 4. 下部の設定メニュー（あれば） */}
      <div class="mt-auto pt-4 border-t border-slate-100">
        <button class="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">
          <span>⚙️</span> 設定
        </button>
      </div>
    </div>
  );
};
