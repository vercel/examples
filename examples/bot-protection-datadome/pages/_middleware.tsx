import type { EdgeRequest, EdgeResponse } from 'next'
import datadome from '@lib/datadome'
import demoMiddleware from '@lib/demo-middleware'

async function handler(req: EdgeRequest, res: EdgeResponse, next) {
  if (!(await datadome(req, res))) return
  next()
}

// if you are using this example as reference,
// feel free to remove the wrapping here which
// is only here to serve this demo
export const middleware = demoMiddleware(handler)
