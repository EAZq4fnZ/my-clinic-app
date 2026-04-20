// src/routes/index.tsx の修正
import { createFileRoute } from '@tanstack/solid-router';

import { PxForm } from '@/features/px/components/PxForm';
import {
  defaultPxValues,
  pxInsertSchema,
  pxInsertValidators,
} from '@/features/px/schemas/pxSchema';

export const Route = createFileRoute('/')({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <main class="p-8">
      <h1 class="text-2xl font-bold mb-4">患者情報登録</h1>
      <div class="bg-white shadow rounded-xl p-4">
        {/* ★ここを確実に修正！ onCancel や onSubmit を渡す */}
        <PxForm
          defaultValues={defaultPxValues}
          validators={pxInsertValidators}
          schema={pxInsertSchema}
          onSubmit={async (data) => {
            console.log('正規化済みデータ:', data);
            alert('保存しました');
          }}
          onCancel={() => console.log('キャンセルされました')}
        />
      </div>
    </main>
  );
}
