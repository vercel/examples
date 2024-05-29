import 'server-only'
import { createSource } from '../generated/hypertune'
import { VercelEdgeConfigInitDataProvider } from 'hypertune'
import { createClient } from '@vercel/edge-config'
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'

const hypertuneSource = createSource({
  token: process.env.NEXT_PUBLIC_HYPERTUNE_TOKEN!,
  initDataProvider:
    process.env.EDGE_CONFIG && process.env.EDGE_CONFIG_HYPERTUNE_ITEM_KEY
      ? new VercelEdgeConfigInitDataProvider({
          edgeConfigClient: createClient(process.env.EDGE_CONFIG),
          itemKey: process.env.EDGE_CONFIG_HYPERTUNE_ITEM_KEY,
        })
      : undefined,
})

export default async function getHypertune(params?: {
  headers: ReadonlyHeaders
  cookies: Omit<RequestCookies, 'set' | 'clear' | 'delete'>
}) {
  await hypertuneSource.initIfNeeded() // Check for flag updates

  return hypertuneSource.root({
    args: {
      context: {
        environment: process.env.NODE_ENV,
        user: { id: '1', name: 'Test', email: 'hi@test.com' },
        // Set placeholder values for browser-only args, e.g.
        // browserOnlyId: "",
      },
    },
  })
}
