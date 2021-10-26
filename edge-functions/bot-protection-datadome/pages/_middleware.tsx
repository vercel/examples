import type { NextRequest } from 'next/server'
import { first } from '@lib/utils'
import datadome from '@lib/datadome'
import demoMiddleware from '@lib/demo-middleware'

function handler(req: NextRequest) {
  return datadome(req)
}

// if you are using this example as reference,
// feel free to remove the wrapping here which
// is only here to serve this demo
export const middleware = first(demoMiddleware, handler)
