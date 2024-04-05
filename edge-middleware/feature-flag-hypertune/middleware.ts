import { NextFetchEvent, NextRequest } from 'next/server'
import hypertune from './lib/hypertune'
import getHypertune from './lib/getHypertune'

export const config = {
  matcher: '/',
}

export async function middleware(req: NextRequest, context: NextFetchEvent) {
  const rootNode = await getHypertune()

  const exampleFlag = rootNode.exampleFlag().get(/* fallback */ false)
  console.log('Edge Middleware flag:', exampleFlag)

  context.waitUntil(hypertune.flushLogs())
}
