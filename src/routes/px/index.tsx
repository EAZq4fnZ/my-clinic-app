// src/routes/patients/index.tsx
import { supabase } from '@/lib/supabase';
import { createFileRoute, useNavigate } from '@tanstack/solid-router';
import { type Component, For, Show, createResource } from 'solid-js';

// 患者一覧ページ

// TanStack Router にこのファイルをルートとして登録します
export const Route = createFileRoute('/px/')({
  component: PatientListPage,
});

// Supabase から患者データを取得する関数
const fetchPatients = async () => {
  const { data, error } = await supabase
    .from('px')
    .select('*')
    .order('last_name_kana', { ascending: true });

  if (error) throw error;
  return data;
};

// 患者一覧ページのコンポーネント
function PatientListPage() {
  const navigate = useNavigate();
  const [patients] = createResource(fetchPatients);

  return (
    <div class="max-w-6xl mx-auto py-8 px-4">
      <header class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">患者一覧</h1>
          <p class="text-sm text-gray-500">
            登録されている患者情報を確認・編集できます。
          </p>
        </div>
        <button
          onClick={() => navigate({ to: '/px/new' })}
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          ＋ 新規登録
        </button>
      </header>

      <div class="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                氏名
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                氏名（カナ）
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                性別
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                生年月日
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <Show
              when={!patients.loading}
              fallback={
                <tr>
                  <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                    読み込み中...
                  </td>
                </tr>
              }
            >
              <For
                each={patients()}
                fallback={
                  <tr>
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                      患者データがありません。
                    </td>
                  </tr>
                }
              >
                {(patient) => (
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {patient.last_name} {patient.first_name}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.last_kana} {patient.first_kana}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.gender_code === 'male'
                        ? '男性'
                        : patient.gender_code === 'female'
                          ? '女性'
                          : 'その他'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.birthday}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          navigate({
                            to: '/px/$patientId',
                            params: { patientId: patient.id },
                          })
                        }
                        class="text-blue-600 hover:text-blue-900"
                      >
                        詳細
                      </button>
                    </td>
                  </tr>
                )}
              </For>
            </Show>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientListPage;
