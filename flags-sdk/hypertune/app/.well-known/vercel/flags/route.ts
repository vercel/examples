import { getProviderData, createFlagsDiscoveryEndpoint } from 'flags/next'
import * as flags from '../../../../flags'

export const runtime = 'edge'

export const GET = createFlagsDiscoveryEndpoint(async () =>
  getProviderData(flags)
)
