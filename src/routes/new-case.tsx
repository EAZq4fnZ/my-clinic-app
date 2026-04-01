import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/new-case')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/new-case"!</div>;
}
