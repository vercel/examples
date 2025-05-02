import { createFlagsDiscoveryEndpoint, getProviderData } from 'flags/next'
import * as flags from '../../../../flags'

export const runtime = 'edge'
export const dynamic = 'force-dynamic' // defaults to auto

export const GET = createFlagsDiscoveryEndpoint(() => getProviderData(flags))
