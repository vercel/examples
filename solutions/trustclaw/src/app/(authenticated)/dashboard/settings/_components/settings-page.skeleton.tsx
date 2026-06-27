import { Skeleton } from '~/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '~/components/ui/card'

function SectionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-10 w-full sm:w-72" />
        <Skeleton className="h-9 w-20" />
      </CardContent>
    </Card>
  )
}

export function SettingsPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-7 w-32" />
      </div>
      <SectionSkeleton />
      <SectionSkeleton />
      <SectionSkeleton />
      <SectionSkeleton />
      <SectionSkeleton />
    </div>
  )
}
