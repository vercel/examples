import { getProviderData, createFlagsDiscoveryEndpoint } from 'flags/next'
import { getProviderData as getBucketProviderData } from '@flags-sdk/bucket'
import { mergeProviderData } from 'flags'
import * as flags from '../../../../flags'

export const dynamic = 'force-dynamic' // defaults to auto

export const GET = createFlagsDiscoveryEndpoint(async (request) => {
  return mergeProviderData([
    // Data declared from Flags in Code
    getProviderData(flags),
    // metadata from Bucket API using the default bucket adapter
    getBucketProviderData(),
  ])
})
