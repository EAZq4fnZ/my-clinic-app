import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/case-id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/case-id"!</div>
}
