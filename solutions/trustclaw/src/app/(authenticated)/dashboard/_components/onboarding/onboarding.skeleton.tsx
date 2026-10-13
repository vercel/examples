import { Skeleton } from '~/components/ui/skeleton'

export function OnboardingSkeleton() {
  return (
    <div className="flex h-full items-start justify-center p-4 pt-12 md:pt-20">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-2 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="mx-auto h-6 w-64" />
          <Skeleton className="mx-auto h-10 w-full" />
        </div>
        <div className="flex justify-end gap-2">
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  )
}
