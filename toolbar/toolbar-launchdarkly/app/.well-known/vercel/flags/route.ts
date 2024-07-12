import { getLaunchDarklyData } from '@vercel/flags/providers/launchdarkly'
import { type NextRequest, NextResponse } from 'next/server'
import { type ApiData, verifyAccess } from '@vercel/flags'

export async function GET(request: NextRequest) {
  const access = await verifyAccess(request.headers.get('Authorization'))
  if (!access) return NextResponse.json(null, { status: 401 })

  const data = await getLaunchDarklyData({
    apiKey: process.env.LAUNCHDARKLY_API_KEY!,
    environment: process.env.LAUNCHDARKLY_ENV!,
    projectKey: process.env.LAUNCHDARKLY_PROJECT_KEY!,
  })

  return NextResponse.json<ApiData>(data)
}
