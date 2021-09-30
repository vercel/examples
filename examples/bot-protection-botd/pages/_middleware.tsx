import type { EdgeRequest, EdgeResponse } from 'next'
import { botdEdge } from '@lib/botd'
import demoMiddleware from '@lib/demo-middleware'

async function handler(req: EdgeRequest, res: EdgeResponse, next: any) {
  if (
    // Do light bot detection for all requests excluding
    // all static files but favicon.ico.
    await botdEdge(req, res, {
      // The request id is excluded for demo purposes because
      // Botd remembers your request id and will always show
      // you the /bot-detected page if you're a bot, and
      // never if you have been identified as a human
      useRequestId: false,
    })
  ) {
    // Bot detected!
    return res.rewrite('/bot-detected')
  }

  next()
}

// if you are using this example as reference,
// feel free to remove the wrapping here which
// is only here to serve this demo
export const middleware = demoMiddleware(handler)
