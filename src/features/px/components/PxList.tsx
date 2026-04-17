// @f/px/components/PxList.tsx
import {
  type ColumnDef,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from '@tanstack/solid-table';
import { format } from 'date-fns';
import { type Component, Show, createMemo } from 'solid-js';
import { For } from 'solid-js';

import type { pxSchema } from '@f/px/schemas/pxSchema';
import { GENDER_LABELS } from '@f/px/schemas/pxSchema';

interface PxListProps {
  data: (typeof pxSchema & { id: string })[]; // ID付きの患者データ
  onSelect: (id: string) => void; // 行クリック時のイベント
}

export const PxList: Component<PxListProps> = (props) => {
  // カラム定義: 短く簡潔に
  const columns: ColumnDef<PxListProps['data'][number]>[] = [
    {
      accessorKey: 'full_name',
      header: '氏名',
      cell: (info) => {
        const row = info.row.original;
        return (
          <div>
            <div class="font-bold text-slate-900">
              {row.last_name} {row.first_name}
            </div>
            <div class="text-xs text-slate-400">
              {row.last_name_kana} {row.first_name_kana}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'gender_type',
      header: '性別',
      cell: (info) =>
        GENDER_LABELS[info.getValue<keyof typeof GENDER_LABELS>()],
    },
    {
      accessorKey: 'birth_date',
      header: '生年月日',
      cell: (info) => {
        const date = info.getValue<string>();
        return date ? format(new Date(date), 'yyyy/MM/dd') : '-';
      },
    },
    {
      accessorKey: 'phone_number',
      header: '電話番号',
    },
    {
      accessorKey: 'address_1',
      header: '住所',
      cell: (info) => (
        <div class="max-w-[200px] truncate">{info.getValue<string>()}</div>
      ),
    },
  ];

  const table = createSolidTable({
    get data() {
      return props.data;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div class="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead class="bg-slate-50 border-b border-slate-200">
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th class="px-4 py-3 font-semibold text-slate-600">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
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
          <tbody class="divide-y divide-slate-100">
            <For each={table.getRowModel().rows}>
              {(row) => (
                <tr
                  onClick={() => props.onSelect(row.original.id)}
                  class="hover:bg-blue-50/50 cursor-pointer transition-colors"
                >
                  <For each={row.getVisibleCells()}>
                    {(cell) => (
                      <td class="px-4 py-3 text-slate-700">
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
          </tbody>
        </table>
      </div>

      {/* データが空の場合の表示 */}
      <Show when={props.data.length === 0}>
        <div class="py-12 text-center text-slate-400">
          患者データが登録されていません
        </div>
      </Show>
    </div>
  );
};
