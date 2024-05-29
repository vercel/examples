import { NextFetchEvent, NextRequest } from 'next/server'
import getHypertune from './lib/getHypertune'

export const config = {
  matcher: '/',
}

export async function middleware(req: NextRequest, context: NextFetchEvent) {
  const hypertune = await getHypertune(req)

  const exampleFlag = hypertune.exampleFlag({ fallback: false })
  console.log('Edge Middleware flag:', exampleFlag)

  context.waitUntil(hypertune.flushLogs())
}
