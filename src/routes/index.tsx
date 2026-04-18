// src/routes/index.tsx
import { createFileRoute } from '@tanstack/solid-router';

import { PxForm } from '@/features/px/components/PxForm';
import {
  defaultPxValues,
  pxInsertSchema,
  pxInsertValidators,
} from '@f/px/schemas/pxSchema';

export const Route = createFileRoute('/')({
  component: IndexComponent,
});

function IndexComponent() {
  const handleSubmit = async (data: any) => {
    console.log('正規化済みデータ:', data);
    alert('登録成功');
  };

  const handleCancel = () => {
    console.log('キャンセルされました');
  };

  return (
    <main class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-3xl mx-auto px-4">
        <header class="mb-8 text-center">
          <h1 class="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            患者情報登録
          </h1>
        </header>

        <div class="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
          {/* PxForm の Props に合わせて修正 */}
          <PxForm
            defaultValues={defaultPxValues}
            validators={pxInsertValidators}
            schema={pxInsertSchema}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </main>
  );
}
