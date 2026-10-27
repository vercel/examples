import { Skeleton } from '~/components/ui/skeleton'

function ToolkitCardSkeleton() {
  return (
    <div className="relative aspect-square rounded-xl border border-border bg-card">
      <div className="flex h-full flex-col items-center justify-center gap-3 p-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}

export function ToolkitsClientSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-full sm:w-72" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <ToolkitCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
