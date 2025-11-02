import { getProviderData, createFlagsDiscoveryEndpoint } from 'flags/next'
import { getProviderData as getReflagProviderData } from '@flags-sdk/reflag'
import { mergeProviderData } from 'flags'
import * as flags from '../../../../flags'

export const dynamic = 'force-dynamic' // defaults to auto

export const GET = createFlagsDiscoveryEndpoint(async (request) => {
  return mergeProviderData([
    // Data declared from Flags in Code
    getProviderData(flags),
    // metadata from Reflag API using the default reflag adapter
    getReflagProviderData(),
  ])
})
