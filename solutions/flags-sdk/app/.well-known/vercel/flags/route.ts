import { createFlagsDiscoveryEndpoint, getProviderData } from 'flags/next'
import * as flags from '../../../../flags'

/**
 * This route sets up the Flags Explorer
 * https://vercel.com/docs/feature-flags/flags-explorer/getting-started#creating-the-flags-api-endpoint
 */
export const GET = createFlagsDiscoveryEndpoint(() => getProviderData(flags))
