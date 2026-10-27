import { trpcServer, HydrateClient } from '~/clients/trpc/server'
import { SettingsPageClient } from './_components/settings-page-client'

export default async function Page() {
  await trpcServer.api.trustclaw.getInstance.prefetch()
  void trpcServer.api.trustclaw.getCronJobs.prefetchInfinite({
    limit: 20,
  })
  void trpcServer.api.trustclaw.getMemories.prefetch({ limit: 50 })

  return (
    <HydrateClient>
      <SettingsPageClient />
    </HydrateClient>
  )
}
