import { Skeleton } from '~/components/ui/skeleton'

export function TrustClawChatSkeleton() {
  return (
    <div className="relative flex h-full overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 space-y-6 p-4">
          <div className="flex flex-col items-end">
            <Skeleton className="h-12 w-48 rounded-2xl" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <Skeleton className="h-8 w-64 rounded-lg" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>

        <div className="border-t border-border p-3 md:p-4">
          <div className="mx-auto flex max-w-2xl items-end gap-2">
            <Skeleton className="h-11 flex-1 rounded-xl" />
            <Skeleton className="size-10 shrink-0 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
