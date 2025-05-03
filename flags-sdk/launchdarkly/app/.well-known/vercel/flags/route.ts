import {
  type ApiData,
  verifyAccess,
  mergeProviderData,
  type ProviderData,
} from 'flags'
import { getProviderData } from 'flags/next'
import { NextResponse, type NextRequest } from 'next/server'
import * as flags from '../../../../flags'
import { getProviderData as getLDProviderData } from '@flags-sdk/launchdarkly'

export const runtime = 'edge'
export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: NextRequest) {
  const access = await verifyAccess(request.headers.get('Authorization'));
  if (!access) return NextResponse.json(null, { status: 401 })

  // Fetches additional metadata from the LaunchDarkly API for the Flags Explorer
  let ldData: ProviderData = { definitions: {}, hints: [] }
  if (
    process.env.LAUNCHDARKLY_API_KEY &&
    process.env.LAUNCHDARKLY_PROJECT_KEY &&
    process.env.LAUNCHDARKLY_ENVIRONMENT
  ) {
    ldData = await getLDProviderData({
      apiKey: process.env.LAUNCHDARKLY_API_KEY,
      projectKey: process.env.LAUNCHDARKLY_PROJECT_KEY,
      environment: process.env.LAUNCHDARKLY_ENVIRONMENT,
    });
  }

  const providerData = await mergeProviderData([
    // Data declared from Flags in Code
    getProviderData(flags),
    // metadata from LaunchDarkly API
    ldData,
  ])

  return NextResponse.json<ApiData>(providerData)
}
