import type { NextRequest } from 'next/server'
import { first } from '@lib/utils'
import datadome from '@lib/datadome'
import demoMiddleware from '@lib/demo-middleware'

async function handler(req: NextRequest) {
  // `datadome(req)` returns a promise that resolves to
  // a respones (NextResponse) or undefined
  //
  // If there's a response, we made a Datadome request.
  //
  // If the response has a body, it means the request
  // was blocked and we should return it, this would
  // be the captcha page of Datadome
  //
  // If there's no body, you're not a bot and we
  // send the response to include Datadome's headers.
  return datadome(req)
}

// if you are using this example as reference,
// feel free to remove the wrapping here which
// is only here to serve this demo
export const middleware = first(demoMiddleware, handler)
