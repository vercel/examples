import {
  type ApiData,
  verifyAccess,
  mergeProviderData,
  type ProviderData,
} from 'flags'
import { getProviderData } from 'flags/next'
import { NextResponse, type NextRequest } from 'next/server'
import * as flags from '../../../../flags'
import { getProviderData as getStatsigProviderData } from '@flags-sdk/statsig'

export const runtime = 'edge'
export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: NextRequest) {
  const access = await verifyAccess(request.headers.get('Authorization'))
  if (!access) return NextResponse.json(null, { status: 401 })

  // Fetches additional metadata from the Statsig API for the Flags Explorer
  let statsigData: ProviderData = { definitions: {}, hints: [] }
  if (process.env.STATSIG_CONSOLE_API_KEY && process.env.STATSIG_PROJECT_ID) {
    statsigData = await getStatsigProviderData({
      statsigConsoleApiKey: process.env.STATSIG_CONSOLE_API_KEY,
      projectId: process.env.STATSIG_PROJECT_ID,
    })
  }

  const providerData = await mergeProviderData([
    // Data declared from Flags in Code
    getProviderData(flags),
    // metadata from Statsig API
    statsigData,
  ])

  return NextResponse.json<ApiData>(providerData)
}
