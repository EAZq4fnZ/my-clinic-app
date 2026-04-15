// src/routes/index.tsx
import { createFileRoute } from '@tanstack/solid-router';

import { PatientForm } from '@f/px/components/PatientForm';

// TanStack Router が認識できるよう、必ず "Route" という名前で export します
export const Route = createFileRoute('/')({
  component: IndexComponent,
});

function IndexComponent() {
  const handleSuccess = (patient: { id: string }) => {
    console.log('登録成功:', patient);
    alert('患者情報を登録しました。');
    // 必要に応じて一覧画面への遷移などをここに記述します
  };

  const handleCancel = () => {
    console.log('キャンセルされました');
    // 入力内容のリセットや画面遷移などをここに記述します
  };

  return (
    <main class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-3xl mx-auto px-4">
        <header class="mb-8 text-center">
          <h1 class="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            患者情報登録
          </h1>
          <p class="mt-2 text-sm text-gray-600">
            新しい患者の基本情報、連絡先、住所を入力してください。
          </p>
        </header>

        <div class="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
          <PatientForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </div>
    </main>
  );
}
