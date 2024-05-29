import { NextRequest, NextResponse } from 'next/server'
import getHypertune from '../../../lib/getHypertune'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
  const rootNode = await getHypertune()

  const exampleFlag = rootNode.exampleFlag({ fallback: false })
  console.log('Edge Function flag:', exampleFlag)

  return NextResponse.json({ exampleFlag })
}
