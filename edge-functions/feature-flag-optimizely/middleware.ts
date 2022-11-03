//@ts-ignore
import { createInstance } from '@optimizely/optimizely-sdk/dist/optimizely.lite.min.js'
import { NextRequest, NextFetchEvent, NextResponse } from 'next/server'
import optimizelyDatafile from './lib/optimizely/datafile.json'

const VERCEL_EDGE_CLIENT_ENGINE = 'javascript-sdk/vercel-edge'
const COOKIE_NAME = 'optimizely_visitor_id'

export const config = {
  matcher: ['/', '/popular'],
}

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  // Fetch user Id from the cookie if available so a returning user from same browser session always sees the same variation.
  const userId = req.cookies.get(COOKIE_NAME)?.value || crypto.randomUUID()

  // Create Optimizely instance using datafile downloaded at build time.
  const instance = createInstance({
    datafile: optimizelyDatafile,
    clientEngine: VERCEL_EDGE_CLIENT_ENGINE,
    eventDispatcher: {
      dispatchEvent: ({ url, params }: { url: string; params: any }) => {
        // Tell edge function to wait for this promise to fullfill.
        ev.waitUntil(
          fetch(url, {
            method: 'POST',
            body: JSON.stringify(params),
          })
        )
      },
    },
  })

  // Create Optimizely User Context
  const userContext = instance!.createUserContext(userId.toString())

  // Decide variation for the flag.
  const decision = userContext!.decide('product_sort')

  // Fetch datafile revision for debugging.
  const revision = instance!.getOptimizelyConfig()!.revision

  console.log(`[OPTIMIZELY] Datafile Revision: ${revision}`)
  console.log(`[OPTIMIZELY] userId: ${userId}`)
  console.log(
    `[OPTIMIZELY] flag 'product_sort' is ${
      decision.enabled ? 'enabled' : 'disabled'
    } for the user ${userId}`
  )
  console.log(
    `[OPTIMIZELY] User ${userId} was bucketed in to variation ${decision.variationKey}`
  )
  console.log(`[OPTIMIZELY] sort_method is ${decision.variables.sort_method}`)

  // Rewriting the path based on sort_method. The default is Alphabetical.
  req.nextUrl.pathname =
    decision.variables.sort_method === 'popular_first' ? '/popular' : '/'
  let res = NextResponse.rewrite(req.nextUrl)

  if (!req.cookies.has(COOKIE_NAME)) {
    // Saving userId in the cookie so that the decision sticks for subsequent visits.
    res.cookies.set(COOKIE_NAME, userId)
  }

  return res
}
