import { VercelEdgeConfigInitDataProvider } from 'hypertune'
import { initHypertune } from '../generated/hypertune'
import { createClient } from '@vercel/edge-config'

const hypertune = initHypertune({
  token: process.env.NEXT_PUBLIC_HYPERTUNE_TOKEN!,
  initDataProvider:
    process.env.EDGE_CONFIG && process.env.EDGE_CONFIG_HYPERTUNE_ITEM_KEY
      ? new VercelEdgeConfigInitDataProvider({
          edgeConfigClient: createClient(process.env.EDGE_CONFIG),
          itemKey: process.env.EDGE_CONFIG_HYPERTUNE_ITEM_KEY,
        })
      : undefined,
})

export default hypertune
