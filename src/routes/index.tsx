import { createFileRoute, Link } from '@tanstack/solid-router';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div class="p-10 flex flex-col items-center justify-center min-h-[60vh]">
      <h1 class="text-4xl font-black text-gray-900 mb-6">接骨院管理システム</h1>
      <div class="flex gap-4">
        <Link 
          to="/patients" 
          class="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all"
        >
          患者一覧を見る
        </Link>
        <Link 
          to="/patient-form" 
          class="bg-white border-2 border-gray-100 text-gray-600 px-8 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-all"
        >
          新規登録
        </Link>
      </div>
    </div>
  );
}