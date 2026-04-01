import { createQuery } from '@tanstack/solid-query';
import { Link, createFileRoute } from '@tanstack/solid-router';
import {
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from '@tanstack/solid-table';
import { For, Show, createSignal } from 'solid-js';

import { fetchPatients } from '@features/patients/services/patientService';

import type { Database } from '@/types/database';
type Patient = Database['public']['Tables']['patients']['Row'];

// ルート定義: フラット構造のルールに従い '/patients/' を指定
export const Route = createFileRoute('/patients/')({
  component: PatientListPage,
});

function PatientListPage() {
  const [searchQuery, setSearchQuery] = createSignal('');

  const query = createQuery(() => ({
    queryKey: ['patients', searchQuery()],
    queryFn: () => fetchPatients(),
  }));

  const h = createColumnHelper<Patient>();

  const columns = [
    h.accessor('last_name', {
      header: '氏名',
      cell: (info) => (
        <div class="flex flex-col text-left">
          <span class="text-[10px] text-gray-400">
            {info.row.original.last_name_kana}
          </span>
          <span class="font-bold text-gray-800">
            {info.getValue()} {info.row.original.first_name}
          </span>
        </div>
      ),
    }),
    h.accessor('phone_number', {
      header: '連絡先',
      cell: (info) => (
        <span class="tabular-nums text-blue-600">{info.getValue() ?? '-'}</span>
      ),
    }),
    h.display({
      id: 'actions',
      header: '操作',
      cell: (info) => (
        <Link
          to="/patients/$patientId"
          params={{ patientId: info.row.original.id }}
          class="text-xs bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg transition-all font-bold"
        >
          詳細
        </Link>
      ),
    }),
  ];

  const table = createSolidTable({
    get data() {
      return query.data ?? [];
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div class="p-8 max-w-5xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-black text-gray-900">患者一覧</h1>
        <input
          type="text"
          placeholder="検索..."
          value={searchQuery()}
          onInput={(e) => setSearchQuery(e.currentTarget.value)}
          class="w-64 border-2 border-gray-100 rounded-xl px-4 py-2 outline-none focus:border-blue-500 transition-all"
        />
      </div>

      <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-gray-50/50 border-b border-gray-100">
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </th>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <Show
              when={!query.isPending}
              fallback={
                <tr>
                  <td colspan="3" class="p-10 text-center text-gray-400 italic">
                    読み込み中...
                  </td>
                </tr>
              }
            >
              <For each={table.getRowModel().rows}>
                {(row) => (
                  <tr class="hover:bg-blue-50/20 transition-colors">
                    <For each={row.getVisibleCells()}>
                      {(cell) => (
                        <td class="px-6 py-4 text-sm text-gray-600">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </Show>
          </tbody>
        </table>
      </div>
    </div>
  );
}
