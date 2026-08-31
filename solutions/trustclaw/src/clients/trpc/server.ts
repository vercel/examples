import 'server-only'

import { createHydrationHelpers } from '@trpc/react-query/rsc'
import { headers } from 'next/headers'
import { cache } from 'react'

import { createCaller, type AppRouter } from '~/server/api/root'
import { createTRPCContext } from '~/server/api/trpc'
import { getQueryClient } from './query-client'

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers())
  heads.set('x-trpc-source', 'rsc')

  return createTRPCContext({
    headers: heads,
  })
})

const caller = createCaller(createContext)

const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient
)

/**
 * Server-side tRPC utilities.
 * For client-side: import { trpc } from "~/clients/trpc"
 */
export const trpcServer = {
  /** Server-side tRPC caller for RSC prefetching */
  api,
  /** Hydrate client-side query cache from server prefetches */
  HydrateClient,
}

export { HydrateClient }
