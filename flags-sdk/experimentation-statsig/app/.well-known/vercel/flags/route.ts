import { getProviderData as getStatsigProviderData } from '@flags-sdk/statsig'
import { type ProviderData, mergeProviderData } from 'flags'
import { createFlagsDiscoveryEndpoint, getProviderData } from 'flags/next'
import * as flags from '../../../../flags'

export const dynamic = 'force-dynamic' // defaults to auto

export const GET = createFlagsDiscoveryEndpoint(async () => {
  // Fetches additional metadata from the Statsig API for the Flags Explorer
  let statsigData: ProviderData = { definitions: {}, hints: [] }
  if (process.env.STATSIG_CONSOLE_API_KEY && process.env.STATSIG_PROJECT_ID) {
    statsigData = await getStatsigProviderData({
      statsigConsoleApiKey: process.env.STATSIG_CONSOLE_API_KEY,
      projectId: process.env.STATSIG_PROJECT_ID,
    })
  }

  return mergeProviderData([
    getProviderData(flags),
    // metadata from Statsig API
    statsigData,
  ])
})
