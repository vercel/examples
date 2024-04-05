import { type NextRequest, NextResponse } from 'next/server'
import { type ApiData, verifyAccess } from '@vercel/flags'
import { getSplitData } from '@vercel/flags/providers/split'

export async function GET(request: NextRequest) {
  const access = await verifyAccess(request.headers.get('Authorization'))
  if (!access) return NextResponse.json(null, { status: 401 })

  const splitData = await getSplitData({
    adminApiKey: process.env.SPLIT_ADMIN_API_KEY!,
    workspaceId: process.env.SPLIT_WORKSPACE_ID!,
    organizationId: process.env.SPLIT_ORGANIZATION_ID!,
    environmentId: process.env.SPLIT_ENVIRONMENT_ID!,
  })

  return NextResponse.json<ApiData>({
    definitions: splitData.definitions,
    hints: Array.isArray(splitData.hints) ? splitData.hints : [],
  })
}
