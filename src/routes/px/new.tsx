// src/routes/px/new.tsx
import { createFileRoute, useNavigate } from '@tanstack/solid-router';

import { PxForm } from '@f/px/components/PxForm';
import {
  defaultPxValues,
  pxInsertSchema,
  pxInsertValidators,
} from '@f/px/schemas/pxSchema';
import { supabase } from '@lib/supabase';

export const Route = createFileRoute('/px/new')({
  component: PxCreatePage,
});

function PxCreatePage() {
  const navigate = useNavigate();

  const handleInsert = async (validatedData: any) => {
    try {
      const { error } = await supabase.from('px').insert(validatedData);

      if (error) {
        throw error;
      }

      alert('登録が完了しました');
      // TanStack Router の navigate はオブジェクト形式
      navigate({ to: '/px' });
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました。');
    }
  };

  const handleCancel = () => {
    // 一覧へ戻る
    navigate({ to: '/px' });
  };

  return (
    <div class="max-w-2xl mx-auto py-8">
      <header class="mb-6 px-4">
        <h1 class="text-2xl font-bold text-gray-800">新規登録</h1>
        <p class="text-sm text-gray-600">
          新しい情報を入力して保存してください。
        </p>
      </header>

      <div class="bg-white shadow rounded-lg border border-gray-200">
        <PxForm
          defaultValues={defaultPxValues}
          validators={pxInsertValidators}
          schema={pxInsertSchema}
          onSubmit={handleInsert}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
