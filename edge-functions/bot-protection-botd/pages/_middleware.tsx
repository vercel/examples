import { NextRequest, NextResponse } from 'next/server'
import { first } from '@lib/utils'
import { botdEdge } from '@lib/botd'
import demoMiddleware from '@lib/demo-middleware'

async function handler(req: NextRequest) {
  // Do light bot detection for all requests excluding
  // all static files but favicon.ico.
  const res = await botdEdge(req, {
    // The request id is excluded for demo purposes because
    // Botd remembers your request id and will always show
    // you the /bot-detected page if you're a bot, and
    // never if you have been identified as a human
    useRequestId: false,
  })

  if (res && res.status !== 200) {
    // Bot detected!
    const url = req.nextUrl.clone()
    url.pathname = '/bot-detected'
    const rewrite = NextResponse.rewrite(url)
    res.headers.forEach((v, k) => rewrite.headers.set(k, v))

    return rewrite
  }
  return res
}

// if you are using this example as reference,
// feel free to remove the wrapping here which
// is only here to serve this demo
export const middleware = first(demoMiddleware, handler)
