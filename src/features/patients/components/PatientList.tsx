import { AlertBadge } from '@/features/accidents/components/AlertBadge';
import { ProgressBadge } from '@/features/accidents/components/ProgressBadge';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database'; // 生成したファイルをインポート
import { formatToJapaneseEra } from '@/utils/dateUtils';
import { Link } from '@tanstack/solid-router';
import { type Component, For, createResource } from 'solid-js';

// 1. データの型定義 (PatientRecord)
/*interface PatientRecord {
  id: string;
  name: string;
  accident_date: string;
  last_visit_date: string | null;
  accident_status: 'initial' | 'negotiating' | 'closed';
  updated_at: string;
}*/
// 特定のテーブルの「1行分」の型を抽出
type Patient = Database['public']['Tables']['patients']['Row'];

// 2. データ取得関数 (Fetch logic)
const fetchPatients = async () => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const PatientList: Component = () => {
  // SolidJSのリソース管理 (非同期データの取得)
  const [patients] = createResource(fetchPatients);

  return (
    <div class="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
              患者名 / 事故日
            </th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
              通院・進捗状況
            </th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
              最終更新
            </th>
            <th class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {/* ローディング状態のハンドリング */}
          {patients.loading && (
            <tr>
              <td
                colspan="4"
                class="px-6 py-4 text-center text-sm text-gray-500"
              >
                読み込み中...
              </td>
            </tr>
          )}

          {/* Javaの for (Patient p : patients) に相当 */}
          <For each={patients()}>
            {(patient) => (
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">
                  <div class="text-sm font-bold text-gray-900">
                    {patient.last_name} {patient.first_name}
                  </div>
                  <div class="text-xs text-gray-500">
                    事故日: {formatToJapaneseEra(patient.accident_date)}
                  </div>
                </td>

                <td class="px-6 py-4">
                  <div class="flex flex-col gap-1.5 items-start">
                    {/* 具象コンポーネント A (通院アラート) */}
                    <AlertBadge date={patient.last_visit_date} />

                    {/* 具象コンポーネント B (進捗ステータス) */}
                    <ProgressBadge status={patient.accident_status} />
                  </div>
                </td>

                <td class="px-6 py-4 text-sm text-gray-500">
                  {formatToJapaneseEra(patient.updated_at)}
                </td>

                <td class="px-6 py-4 text-right">
                  <Link
                    to={`/patients/${patient.id}`}
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    詳細を表示 →
                  </Link>
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>

      {/* データが空の場合の表示 */}
      {!patients.loading && patients()?.length === 0 && (
        <div class="p-12 text-center text-gray-400 text-sm">
          登録されている患者データがありません。
        </div>
      )}
    </div>
  );
};
