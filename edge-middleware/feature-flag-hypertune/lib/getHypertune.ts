import 'server-only'
import { createSource } from '../generated/hypertune'
import { VercelEdgeConfigInitDataProvider } from 'hypertune'
import { createClient } from '@vercel/edge-config'

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

export default async function getHypertune() {
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
