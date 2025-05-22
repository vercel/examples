import { getProviderData, createFlagsDiscoveryEndpoint } from 'flags/next'
import { getProviderData as getPostHogProviderData } from '@flags-sdk/posthog'
import { mergeProviderData } from 'flags'
import * as flags from '../../../../flags'

export const dynamic = 'force-dynamic' // defaults to auto

export const getAppHost = () => {
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

  if (!host) {
    throw new Error('NEXT_PUBLIC_POSTHOG_HOST is not set')
  }

  if (host.includes("us.i.posthog.com")) {
    return "https://us.posthog.com"
  }

  if (host.includes("eu.i.posthog.com")) {
    return "https://eu.posthog.com"
  }

  return host
}

export const GET = createFlagsDiscoveryEndpoint(async (request) => {

  return mergeProviderData([
    // Data declared from Flags in Code
    getProviderData(flags),
    // metadata from PostHog API using the default posthog adapter
    getPostHogProviderData({
      personalApiKey: process.env.POSTHOG_PERSONAL_API_KEY,
      host: getAppHost(),
      projectId: process.env.POSTHOG_PROJECT_ID,
    }),
  ])
}, {
  secret: process.env.FLAGS_SECRET
})
