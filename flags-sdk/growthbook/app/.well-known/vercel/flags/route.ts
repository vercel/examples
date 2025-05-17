import { getProviderData as getGrowthbookProviderData } from '@flags-sdk/growthbook'
import { type ProviderData, mergeProviderData } from 'flags'
import { createFlagsDiscoveryEndpoint, getProviderData } from 'flags/next'
import * as flags from '../../../../flags'

export const runtime = 'edge'
export const dynamic = 'force-dynamic' // defaults to auto

export const GET = createFlagsDiscoveryEndpoint(async () => {
  // Fetches additional metadata from the GrowthBook API for the Flags Explorer
  let growthbookData: ProviderData = { definitions: {}, hints: [] }
  if (process.env.GROWTHBOOK_API_KEY) {
    growthbookData = await getGrowthbookProviderData({
      apiKey: process.env.GROWTHBOOK_API_KEY,
    })
  }

  return mergeProviderData([
    getProviderData(flags),
    // metadata from GrowthBook API
    growthbookData,
  ])
})
