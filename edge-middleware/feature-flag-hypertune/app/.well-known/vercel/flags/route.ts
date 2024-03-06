import { NextResponse } from 'next/server'
import { encryptApiData } from '@vercel/flags'
import { vercelFlagDefinitions } from '../../../../generated/generated'

export async function GET() {
  const apiData = { definitions: vercelFlagDefinitions }
  const encryptedApiData = await encryptApiData(apiData)
  return NextResponse.json(encryptedApiData)
}
