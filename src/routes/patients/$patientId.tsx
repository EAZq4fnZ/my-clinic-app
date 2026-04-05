import { supabase } from '@/lib/supabase';
import { formatToJapaneseEra } from '@/utils/dateUtils';
import { Link, createFileRoute, useParams } from '@tanstack/solid-router';
import { For, Show, createResource } from 'solid-js';

export const Route = createFileRoute('/patients/$patientId')({
  component: PatientDetail,
});

export default function PatientDetail() {
  const params = useParams({ from: '/patients/$patientId' });

  // 患者基本情報と、紐付く事故案件をまとめて取得
  const [patientData] = createResource(async () => {
    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        accidents (
          *,
          treatment_records (
            status,
            updated_at
          )
        )
      `)
      .eq('id', params.patientId)
      .single();

    if (error) throw error;
    return data;
  });

  return (
    <div class="p-6 max-w-5xl mx-auto space-y-8">
      {/* ヘッダー・基本情報セクション */}
      <Show when={patientData()} fallback={<p>読み込み中...</p>}>
        {(p) => (
          <>
            <header class="flex justify-between items-start">
              <div>
                <div class="text-sm text-gray-500 mb-1">
                  患者番号: {p().id.slice(0, 8)}
                </div>
                <h1 class="text-3xl font-bold text-gray-900">
                  {p().last_name} {p().first_name}
                  <span class="text-lg font-normal text-gray-500 ml-4">
                    ({p().last_name_kana} {p().first_name_kana})
                  </span>
                </h1>
                <p class="mt-2 text-gray-600">
                  {formatToJapaneseEra(p().birth_date)} 生
                </p>
              </div>
              <A
                href={`/patients/edit/${p().id}`}
                class="text-blue-600 hover:underline font-medium"
              >
                基本情報を編集
              </A>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div>
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  連絡先・住所
                </h3>
                <p class="text-gray-800">
                  {p().phone_number || '電話番号未登録'}
                </p>
                <p class="text-gray-600 text-sm mt-1">
                  〒{p().zip_code}
                  <br />
                  {p().address}
                </p>
              </div>
            </div>

            {/* 事故案件一覧セクション */}
            <section class="space-y-4">
              <div class="flex justify-between items-center border-b pb-2">
                <h2 class="text-xl font-bold text-gray-800">事故案件履歴</h2>
                <A
                  href={`/patients/${p().id}/accidents/new`}
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  ＋ 新規事故案件を登録
                </A>
              </div>

              <div class="grid grid-cols-1 gap-4">
                <For
                  each={p().accidents}
                  fallback={
                    <div class="text-center py-12 bg-white border-2 border-dashed rounded-xl text-gray-400">
                      登録された事故案件はありません。
                    </div>
                  }
                >
                  {(accident) => {
                    // 最新の進捗状況を取得
                    const latestRecord = accident.treatment_records?.sort(
                      (a, b) =>
                        new Date(b.updated_at).getTime() -
                        new Date(a.getTime).getTime(),
                    )[0];

                    return (
                      <A
                        href={`/accidents/${accident.id}`}
                        class="block bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-blue-400 transition-all group"
                      >
                        <div class="flex justify-between items-start">
                          <div>
                            <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                              事故日:{' '}
                              {formatToJapaneseEra(accident.accident_date)}
                            </span>
                            <h4 class="text-lg font-bold text-gray-900 mt-2 group-hover:text-blue-600">
                              {accident.injury_name || '傷病名未入力'}
                            </h4>
                            <p class="text-sm text-gray-500 mt-1">
                              保険会社: {accident.insurance_company || '不明'}
                            </p>
                          </div>
                          <div class="text-right">
                            <div class="text-sm font-medium text-gray-900">
                              状態: {latestRecord?.status || '未着手'}
                            </div>
                            <div class="text-xs text-gray-400 mt-1">
                              最終更新:{' '}
                              {formatToJapaneseEra(latestRecord?.updated_at)}
                            </div>
                          </div>
                        </div>
                      </A>
                    );
                  }}
                </For>
              </div>
            </section>
          </>
        )}
      </Show>
    </div>
  );
}
