import { type ApiData, verifyAccess, mergeProviderData } from 'flags'
import { getProviderData } from 'flags/next'
import { NextResponse, type NextRequest } from 'next/server'
import * as flags from '../../../../flags'
import { getProviderData as getBucketProviderData } from '@flags-sdk/bucket'

export const runtime = 'edge'
export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: NextRequest) {
  const access = await verifyAccess(request.headers.get('Authorization'))
  if (!access) return NextResponse.json(null, { status: 401 })

  const providerData = await mergeProviderData([
    // Data declared from Flags in Code
    getProviderData(flags),
    // metadata from Bucket API using the default bucket adapter
    getBucketProviderData(),
  ])

  return NextResponse.json<ApiData>(providerData)
}
