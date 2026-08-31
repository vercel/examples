import { trpcServer, HydrateClient } from '~/clients/trpc/server'
import { ToolkitsClient } from './_components/toolkits-client'

export default async function Page() {
  void trpcServer.api.toolkits.getToolkits.prefetchInfinite({
    limit: 20,
  })

  return (
    <HydrateClient>
      <ToolkitsClient />
    </HydrateClient>
  )
}
