import { getProviderData } from '@flags-sdk/launchdarkly'
import { createFlagsDiscoveryEndpoint } from 'flags/next'

export const GET = createFlagsDiscoveryEndpoint(async () =>
  getProviderData({
    apiKey: process.env.LAUNCHDARKLY_API_KEY!,
    environment: process.env.LAUNCHDARKLY_ENV!,
    projectKey: process.env.LAUNCHDARKLY_PROJECT_KEY!,
  })
)
