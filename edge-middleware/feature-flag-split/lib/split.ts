import {
  SplitFactory,
  PluggableStorage,
  ErrorLogger,
} from '@splitsoftware/splitio-browserjs'
import { EdgeConfigWrapper } from '@splitsoftware/vercel-integration-utils'
import { createClient } from '@vercel/edge-config'

const edgeConfigClient = createClient(process.env.EDGE_CONFIG)

export async function createSplitClient(userKey: string) {
  const client = SplitFactory({
    core: {
      authorizationKey: process.env.SPLIT_SDK_CLIENT_API_KEY!,
      key: userKey,
    },
    mode: 'consumer_partial',
    storage: PluggableStorage({
      wrapper: EdgeConfigWrapper({
        // The Edge Config item where Split stores feature flag definitions, specified in the Split integration step
        edgeConfigItemKey: process.env.EDGE_CONFIG_SPLIT_ITEM_KEY!,
        edgeConfig: edgeConfigClient,
      }),
    }),
    // Disable or keep only ERROR log level in production, to minimize performance impact
    debug: ErrorLogger(),
  }).client()

  // Wait to load feature flag definitions from the Edge Config
  await client.ready()

  return client
}
