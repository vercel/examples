import { getProviderData, createFlagsDiscoveryEndpoint } from 'flags/next'
import { getProviderData as getPostHogProviderData } from '@flags-sdk/posthog'
import { mergeProviderData } from 'flags'
import * as flags from '../../../../flags'

export const dynamic = 'force-dynamic' // defaults to auto

export const GET = createFlagsDiscoveryEndpoint(
  async (request) => {
    return mergeProviderData([
      // Data declared from Flags in Code
      getProviderData(flags),
      // metadata from PostHog API using the default posthog adapter
      getPostHogProviderData({
        personalApiKey: process.env.POSTHOG_PERSONAL_API_KEY,
        projectId: process.env.POSTHOG_PROJECT_ID,
      }),
    ])
  },
  {
    secret: process.env.FLAGS_SECRET,
  }
)
