import { initializeHypertune } from '../generated/generated'
import { createClient } from '@vercel/edge-config'

const hypertune = initializeHypertune(
  {},
  {
    token: process.env.NEXT_PUBLIC_HYPERTUNE_TOKEN,
    vercelEdgeConfigClient: process.env.EDGE_CONFIG
      ? createClient(process.env.EDGE_CONFIG)
      : undefined,
    vercelEdgeConfigItemKey: process.env.EDGE_CONFIG_HYPERTUNE_ITEM_KEY,
  },
)

export default hypertune
