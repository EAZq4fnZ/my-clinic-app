import { StatusBadge } from '@/components/ui/StatusBadge';
import { supabase } from '@/lib/supabase';
import { formatToJapaneseEra, getAlertStatus } from '@/utils/dateUtils';
import { Link, createFileRoute, useParams } from '@tanstack/solid-router';
import { For, Show, createResource, createSignal } from 'solid-js';

export const Route = createFileRoute('/accidents/$accidentId')({
  component: AccidentDetail,
});

export default function AccidentDetail() {
  const params = useParams({ from: '/accidents/$accidentId' });
  const [isUpdating, setIsUpdating] = createSignal(false);

  // 事故情報と紐付く患者、および進捗履歴（treatment_records）を取得
  const [accidentData, { refetch }] = createResource(async () => {
    const { data, error } = await supabase
      .from('accidents')
      .select(`
        *,
        patients (*),
        treatment_records (*)
      `)
      .eq('id', params.accidentId)
      .single();

    if (error) throw error;

    // 履歴を日付の降順（新しい順）にソート
    data.treatment_records.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );

    return data;
  });

  // 進捗（ステータス）を更新する処理
  const handleUpdateStatus = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    setIsUpdating(true);
    const { error } = await supabase.from('treatment_records').insert({
      accident_id: params.accidentId,
      status: formData.get('status') as string,
      notes: formData.get('notes') as string,
      updated_at: new Date().toISOString(),
    });

    setIsUpdating(false);
    if (error) alert('更新に失敗しました: ' + error.message);
    else {
      form.reset();
      refetch(); // データを再取得して表示を更新
    }
  };

  return (
    <div class="p-6 max-w-4xl mx-auto space-y-8">
      <Show when={accidentData()} fallback={<p>読み込み中...</p>}>
        {(acc) => (
          <>
            {/* ヘッダー：患者名と事故概要 */}
            <header class="flex justify-between items-center border-b pb-4">
              <div>
                <Link
                  to={`/patients/${acc().patient_id}`}
                  class="text-sm text-blue-600 hover:underline"
                >
                  ← 患者詳細に戻る
                </Link>
                <h1 class="text-2xl font-bold text-gray-900 mt-2">
                  {acc().patients.last_name} {acc().patients.first_name}{' '}
                  様の事故案件
                </h1>
                <p class="text-gray-500">
                  事故日: {formatToJapaneseEra(acc().accident_date)} | 傷病名:{' '}
                  {acc().injury_name}
                </p>
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400 block">案件ID</span>
                <span class="font-mono text-sm">{acc().id.slice(0, 8)}</span>
              </div>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 左側：現在のステータス更新フォーム */}
              <section class="md:col-span-1 space-y-4">
                <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h2 class="font-bold text-gray-800 mb-4">進捗を更新</h2>
                  <form onSubmit={handleUpdateStatus} class="space-y-4">
                    <div>
                      <label class="block text-xs font-bold text-gray-400 mb-1">
                        現在の状態
                      </label>
                      <select
                        name="status"
                        required
                        class="w-full border rounded-md px-2 py-2 bg-gray-50"
                      >
                        <option value="未請求">未請求</option>
                        <option value="請求済み">請求済み</option>
                        <option value="承認待ち">承認待ち</option>
                        <option value="振込済み">振込済み</option>
                        <option value="中断">中断</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-gray-400 mb-1">
                        対応メモ
                      </label>
                      <textarea
                        name="notes"
                        rows={3}
                        class="w-full border rounded-md px-2 py-2 bg-gray-50 text-sm"
                        placeholder="保険会社と連絡等"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isUpdating()}
                      class="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-all"
                    >
                      {isUpdating() ? '更新中...' : '履歴を追加'}
                    </button>
                  </form>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg border border-dashed text-sm text-gray-600">
                  <h3 class="font-bold mb-2">保険情報</h3>
                  <p>会社: {acc().insurance_company || '-'}</p>
                  <p>番号: {acc().policy_number || '-'}</p>
                </div>
              </section>

              {/* 右側：タイムライン履歴 */}
              <section class="md:col-span-2">
                <h2 class="font-bold text-gray-800 mb-4">対応・請求履歴</h2>
                <div class="relative border-l-2 border-gray-200 ml-4 space-y-8">
                  <For
                    each={acc().treatment_records}
                    fallback={
                      <p class="ml-6 text-gray-400 text-sm">
                        履歴はまだありません。
                      </p>
                    }
                  >
                    {(record) => (
                      <div class="relative ml-6">
                        {/* タイムラインの点 */}
                        <div
                          class={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-white ${
                            getAlertStatus(record.updated_at) === 'critical'
                              ? 'bg-red-500'
                              : 'bg-blue-500'
                          }`}
                        />

                        <div class="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                          <div class="flex justify-between items-start mb-2">
                            <StatusBadge status={record.status} />
                            <time class="text-xs text-gray-400 font-mono">
                              {formatToJapaneseEra(record.updated_at)}
                            </time>
                          </div>
                          <Show when={record.notes}>
                            <p class="text-sm text-gray-700 whitespace-pre-wrap">
                              {record.notes}
                            </p>
                          </Show>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </section>
            </div>
          </>
        )}
      </Show>
    </div>
  );
}
