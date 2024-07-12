import { type NextRequest, NextResponse } from 'next/server'
import { type ApiData, verifyAccess } from '@vercel/flags'
import { getOptimizelyData } from '@vercel/flags/providers/optimizely'

export async function GET(request: NextRequest) {
  const access = await verifyAccess(request.headers.get('Authorization'))
  if (!access) return NextResponse.json(null, { status: 401 })

  const data = await getOptimizelyData({
    projectId: process.env.OPTIMIZELY_PROJECT_ID!,
    apiKey: process.env.OPTIMIZELY_API_KEY!,
  })

  return NextResponse.json<ApiData>(data)
}
