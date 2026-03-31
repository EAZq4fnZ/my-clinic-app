import { createFileRoute, Link } from '@tanstack/solid-router';
import { createQuery } from '@tanstack/solid-query';
import { Show } from 'solid-js';
import { fetchPatients } from '@features/patients/services/patientService';

export const Route = createFileRoute('/patients/$patientId')({
  component: PatientDetailPage,
});

function PatientDetailPage() {
  // TanStack Router の useParams は Accessor を返すため、関数として実行してからプロパティにアクセスします
  const params = Route.useParams();
  const patientId = () => params().patientId;

  // 患者詳細データの取得クエリ
  const query = createQuery(() => ({
    // key に関数実行結果を含めることで、IDが変わるたびに再取得されます
    queryKey: ['patient', patientId()],
    queryFn: async () => {
      const patients = await fetchPatients();
      const found = patients.find((p) => p.id === patientId());
      if (!found) throw new Error('患者が見つかりません');
      return found;
    },
  }));

  return (
    <div class="p-8 max-w-4xl mx-auto">
      <div class="mb-6">
        <Link 
          to="/patients" 
          class="text-blue-600 hover:underline text-sm flex items-center gap-1"
        >
          <span>←</span> 患者一覧に戻る
        </Link>
      </div>

      <Show 
        when={query.data} 
        fallback={
          <div class="animate-pulse bg-gray-100 h-64 rounded-3xl flex items-center justify-center text-gray-400">
            読み込み中...
          </div>
        }
      >
        {(patient) => (
          <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <header class="flex justify-between items-start mb-8">
              <div>
                <span class="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1 block">
                  Patient ID: {patientId()}
                </span>
                <h1 class="text-3xl font-bold text-gray-900">
                  {patient().last_name} {patient().first_name} 様
                </h1>
              </div>
              <div class="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-bold border border-green-100">
                有効なカルテ
              </div>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section class="space-y-6">
                <div>
                  <h2 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 border-b pb-1">基本情報</h2>
                  <div class="space-y-4">
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-400">生年月日</span>
                      <span class="text-lg text-gray-700 font-medium">
                        {patient().birth_date || '未登録'}
                      </span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-400">住所</span>
                      <span class="text-gray-700">
                        {patient().address || '住所情報はありません'}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section class="space-y-6">
                <div>
                  <h2 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 border-b pb-1">診察アクション</h2>
                  <div class="flex flex-col gap-3">
                    <button class="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]">
                      新規診察を開始する
                    </button>
                    <button class="w-full bg-white text-gray-600 py-3 rounded-2xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all">
                      登録情報の編集
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </Show>

      <Show when={query.isError}>
        <div class="mt-4 bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex flex-col gap-2">
          <span class="font-bold">データの取得に失敗しました</span>
          <p class="text-sm opacity-80">{query.error?.message}</p>
          <button 
            onClick={() => query.refetch()}
            class="mt-2 text-sm bg-red-600 text-white px-4 py-2 rounded-lg w-fit"
          >
            再試行
          </button>
        </div>
      </Show>
    </div>
  );
}