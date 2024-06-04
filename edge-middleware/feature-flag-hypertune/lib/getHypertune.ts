import 'server-only'
import { VercelEdgeConfigInitDataProvider } from 'hypertune'
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'
import { unstable_noStore as noStore } from 'next/cache'
import { createClient } from '@vercel/edge-config'
import { Environment, createSource } from '../generated/hypertune'
import { getVercelOverride } from '../generated/hypertune.vercel'

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
  noStore()
  await hypertuneSource.initIfNeeded() // Check for flag updates

  // Respect overrides set by the Vercel Toolbar
  hypertuneSource.setOverride(await getVercelOverride())

  return hypertuneSource.root({
    args: {
      context: {
        environment: process.env.NODE_ENV.toUpperCase() as Environment,
        user: { id: '1', name: 'Test', email: 'hi@test.com' },
        // Set placeholder values for browser-only args, e.g.
        // browserOnlyId: "",
      },
    },
  })
}
