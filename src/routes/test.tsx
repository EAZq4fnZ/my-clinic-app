import { EraDatePickerSandbox } from '@/testing/EraDatePickerSandbox';
import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/test')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div class="p-20">
      <EraDatePickerSandbox />
    </div>
  );
}
