import { NextFetchEvent, NextRequest } from 'next/server'
import hypertune from './lib/hypertune'

export const config = {
  matcher: '/',
}

export async function middleware(req: NextRequest, context: NextFetchEvent) {
  await hypertune.initFromVercelEdgeConfig()

  const rootNode = hypertune.root({
    context: {
      user: { id: 'test', name: 'Test', email: 'test@test.com' },
    },
  })
  const exampleFlag = rootNode.exampleFlag().get(/* fallback */ false)
  console.log('Middleware feature flag:', exampleFlag)

  context.waitUntil(hypertune.flushLogs())
}
