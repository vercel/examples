import { NextResponse } from 'next/server'
import getHypertune from '../../../lib/getHypertune'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
  const hypertune = await getHypertune()

  const exampleFlag = hypertune.exampleFlag({ fallback: false })

  return NextResponse.json({ exampleFlag })
}
