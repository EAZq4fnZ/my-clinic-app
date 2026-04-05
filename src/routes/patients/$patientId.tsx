// src/routes/patients/$patientId.tsx
import { supabase } from '@/lib/supabase';
import { createFileRoute, useNavigate } from '@tanstack/solid-router';
import { type Component, Show, createResource } from 'solid-js';

// 患者の詳細ページコンポーネント (ルート定義とデータ取得ロジックを含む)
// ルート定義
export const Route = createFileRoute('/patients/$patientId')({
  component: PatientDetailPage,
});

// Supabaseから患者データを取得する関数
const fetchPatient = async (id: string) => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// 患者の詳細情報を表示するコンポーネント
function PatientDetailPage() {
  const params = Route.useParams(); // URLからIDを取得
  const navigate = useNavigate();
  const [patient] = createResource(() => params().patientId, fetchPatient);

  return (
    <div class="max-w-4xl mx-auto py-8 px-4">
      <header class="flex justify-between items-center mb-8">
        <div>
          <button
            onClick={() => navigate({ to: '/patients' })}
            class="text-sm text-blue-600 hover:underline mb-2 block"
          >
            ← 患者一覧に戻る
          </button>
          <h1 class="text-2xl font-bold text-gray-800">患者詳細情報</h1>
        </div>
        <div class="flex gap-3">
          {/* 編集機能などは今後追加可能 */}
          <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            編集する
          </button>
        </div>
      </header>

      <Show
        when={!patient.loading}
        fallback={<p class="text-center py-10 text-gray-500">読み込み中...</p>}
      >
        <div class="bg-white shadow rounded-xl border border-gray-200 overflow-hidden">
          <div class="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 class="text-lg font-bold text-gray-900">
              {patient()?.last_name} {patient()?.first_name}
              <span class="ml-3 text-sm font-normal text-gray-500">
                ({patient()?.last_name_kana} {patient()?.first_name_kana})
              </span>
            </h2>
          </div>

          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <section>
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                性別
              </label>
              <p class="mt-1 text-gray-700">
                {patient()?.gender_type === 'male'
                  ? '男性'
                  : patient()?.gender_type === 'female'
                    ? '女性'
                    : 'その他'}
              </p>
            </section>

            <section>
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                生年月日
              </label>
              <p class="mt-1 text-gray-700">{patient()?.birth_date}</p>
            </section>

            <section>
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                電話番号
              </label>
              <p class="mt-1 text-gray-700">
                {patient()?.phone_number || '未登録'}
              </p>
            </section>

            <section>
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                郵便番号
              </label>
              <p class="mt-1 text-gray-700">〒{patient()?.zip_code}</p>
            </section>

            <section class="md:col-span-2">
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                住所
              </label>
              <p class="mt-1 text-gray-700">
                {patient()?.address_1}
                {patient()?.address_2 && (
                  <span class="block mt-1">{patient()?.address_2}</span>
                )}
              </p>
            </section>
          </div>
        </div>
      </Show>
    </div>
  );
}
// 患者の詳細ページコンポーネントをエクスポート
export default PatientDetailPage;
