// src/components/ui/DashboardCard.tsx
import { Show } from 'solid-js';

export const DashboardCard = (props: {
  title: string;
  children: any;
  footer?: any;
}) => {
  return (
    <div class="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div class="p-5">
        <h3 class="text-sm font-bold text-slate-900 mb-4">{props.title}</h3>
        <div class="text-slate-600">{props.children}</div>
      </div>
      <Show when={props.footer}>
        <div class="px-5 py-3 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
          {props.footer}
        </div>
      </Show>
    </div>
  );
};
