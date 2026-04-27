// src/ui/shared/Toaster.tsx
import { Toaster as ArkToaster, Toast, createToaster } from '@ark-ui/solid';
import { XIcon } from 'lucide-solid'; // アイコンライブラリ例

export const toaster = createToaster({
  placement: 'top-end',
  gap: 24,
});

export const Toaster = () => {
  return (
    <ArkToaster toaster={toaster}>
      {(toast) => (
        <Toast.Root class="bg-white shadow-lg border border-slate-200 p-4 rounded-xl min-w-[300px] flex justify-between items-start data-[state=open]:animate-in data-[state=closed]:animate-out">
          <div class="grid gap-1">
            <Toast.Title class="text-sm font-bold text-slate-900">
              {toast().title}
            </Toast.Title>
            <Toast.Description class="text-xs text-slate-500">
              {toast().description}
            </Toast.Description>
          </div>
          <Toast.CloseTrigger class="text-slate-400 hover:text-slate-600">
            <XIcon size={16} />
          </Toast.CloseTrigger>
        </Toast.Root>
      )}
    </ArkToaster>
  );
};

// 使い方例:
// toaster.create({ title: "成功", description: "保存しました", type: "success" });
