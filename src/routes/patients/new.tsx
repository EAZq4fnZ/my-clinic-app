// src/routes/patients/new.tsx
import { createFileRoute, useNavigate } from '@tanstack/solid-router';

import { PatientForm } from '@f/patients/components/PatientForm';

export const Route = createFileRoute('/patients/new')({
  component: PatientNewPage,
});

function PatientNewPage() {
  const navigate = useNavigate();

  return (
    <div class="container mx-auto py-6 max-w-2xl">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">患者情報の新規登録</h1>
        <p class="text-sm text-gray-500 mt-1">
          基本情報を入力して新しい患者レコードを作成します。
        </p>
      </div>

      <div class="bg-white shadow-sm border rounded-xl p-6">
        <PatientForm
          onSuccess={(patient: { id: string }) => {
            // 登録成功時、詳細画面へ遷移
            // ※パス "/patients/$patientId" が routeTree.gen.ts に定義されている必要があります
            navigate({
              to: '/patients/$patientId',
              params: { patientId: patient.id },
            });
          }}
          onCancel={() => {
            // キャンセル時は一覧に戻る
            navigate({ to: '/patients' });
          }}
        />
      </div>
    </div>
  );
}
