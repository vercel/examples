import { type NextRequest, NextResponse } from 'next/server'
import { type ApiData, verifyAccess } from '@vercel/flags'
import { getStatsigData } from '@vercel/flags/providers/statsig'

export async function GET(request: NextRequest) {
  const access = await verifyAccess(request.headers.get('Authorization'))
  if (!access) return NextResponse.json(null, { status: 401 })

  const data = await getStatsigData({
    consoleApiKey: process.env.STATSIG_CONSOLE_API_KEY!,
    projectId: process.env.STATSIG_PROJECT_ID!,
  })

  return NextResponse.json<ApiData>(data)
}
