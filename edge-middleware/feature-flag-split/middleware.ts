import { NextRequest, NextResponse } from 'next/server'
import {
  SplitFactory,
  PluggableStorage,
  ErrorLogger,
} from '@splitsoftware/splitio-browserjs'
import { EdgeConfigWrapper } from '@splitsoftware/vercel-integration-utils'
import * as EdgeConfigClient from '@vercel/edge-config'

export const config = {
  matcher: ['/about', '/marketing'],
}

const SPLIT_COOKIE = 'split_user_key'

const FEATURE_FLAG_NAME = 'feature_flag_example'

export async function middleware(req: NextRequest) {
  // Extract user key from cookie or generate one, to provide the same variation per visitor
  const userKey = req.cookies.get(SPLIT_COOKIE)?.value || crypto.randomUUID()

  // Init Split SDK in partial consumer mode to read feature flag definitions from the provided Edge Config client
  const client = SplitFactory({
    core: {
      authorizationKey: process.env.SPLIT_SDK_KEY,
      key: userKey,
    },
    mode: 'consumer_partial',
    storage: PluggableStorage({
      wrapper: EdgeConfigWrapper({
        // The Edge Config item where Split stores feature flag definitions, specified in the Split integration step
        edgeConfigItemKey: process.env.SPLIT_EDGE_CONFIG_ITEM_KEY,
        // The Edge Config client. In this case, we are passing the default client
        // that reads from the Edge Config stored in process.env.EDGE_CONFIG
        edgeConfig: EdgeConfigClient,
      }),
    }),
    // Disable or keep only ERROR log level in production, to minimize performance impact
    debug: ErrorLogger(),
  }).client()

  // Wait until the SDK is ready or timed out. If timeout occurs, treatment evaluations will default to 'control'.
  // A timeout should not occur if Edge Config is properly configured and synchronized.
  await new Promise((res) => {
    client.on(client.Event.SDK_READY, res)
    client.on(client.Event.SDK_READY_TIMED_OUT, res)
  })

  // Evaluate a feature flag. In this case, we use the result treatment to overwrite the pathname
  const treatment = await client.getTreatment(FEATURE_FLAG_NAME)
  if (treatment === 'on') req.nextUrl.pathname = `${req.nextUrl.pathname}/b`

  const res = NextResponse.rewrite(req.nextUrl)

  // Add the cookie if it's not there
  if (!req.cookies.has(SPLIT_COOKIE)) res.cookies.set(SPLIT_COOKIE, userKey)

  return res
}
