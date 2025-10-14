import { getProviderData, createFlagsDiscoveryEndpoint } from 'flags/next'
import { getProviderData as getFlagSmithProviderData } from '@flags-sdk/flagsmith'
import { mergeProviderData } from 'flags'
import * as flags from '../../../../flags'

export const dynamic = 'force-dynamic' // defaults to auto

export const GET = createFlagsDiscoveryEndpoint(
  async () => {
    return mergeProviderData([
      // Data declared from Flags in Code
      getProviderData(flags),
      // metadata from Flagsmith API using the default flagsmith adapter
      getFlagSmithProviderData({
        environmentKey: process.env.FLAGSMITH_ENVIRONMENT_ID as string,
        projectId: process.env.FLAGSMITH_PROJECT_ID as string,
      }),
    ])
  },
  {
    secret: process.env.FLAGS_SECRET,
  }
)
