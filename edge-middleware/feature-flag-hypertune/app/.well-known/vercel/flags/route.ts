import { type NextRequest, NextResponse } from 'next/server'
import { verifyAccess, type ApiData } from '@vercel/flags'
import { getHypertuneData } from '@vercel/flags/providers/hypertune'

export async function GET(request: NextRequest) {
  const access = await verifyAccess(request.headers.get('Authorization'))
  if (!access) {
    return NextResponse.json(null, { status: 401 })
  }

  const data = await getHypertuneData({
    token: process.env.HYPERTUNE_ADMIN_TOKEN!,
  })
  return NextResponse.json<ApiData>(data)
}
