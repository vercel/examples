//@ts-ignore
import { createInstance } from '@optimizely/optimizely-sdk/dist/optimizely.lite.min.js';
import { NextRequest, NextFetchEvent, NextResponse } from "next/server";
import optimizelyDatafile from '../lib/optimizely/datafile.json';

const COOKIE_NAME = 'optimizely_visitor_id';

function generateRandomUserId(): string {
  return Math.floor(Math.random() * 899999 + 100000) as unknown as string
}

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (!req.page.name) {
    return NextResponse.next()
  }

  // Fetch user Id from the cookie if available so a returning user from same browser session always sees the same variation.
  const userId = req.cookies[COOKIE_NAME] || generateRandomUserId()

  // Create Optimizely instance using datafile downloaded at build time.
  const instance = createInstance({ datafile: optimizelyDatafile })

  // Create Optimizely User Context
  const userContext = instance.createUserContext(userId.toString())

  // Decide variation for the flag.
  const decision = userContext.decide('product_sort')

  // Fetch datafile revision for debugging.
  const revision = instance.getOptimizelyConfig().revision
  
  console.log(`[OPTIMIZELY] Datafile Revision: ${revision}`)
  console.log(`[OPTIMIZELY] userId: ${userId}`)
  console.log(`[OPTIMIZELY] flag 'product_sort' is ${decision.enabled ? 'enabled' : 'disabled'} for the user ${userId}`)
  console.log(`[OPTIMIZELY] User ${userId} was bucketed in to variation ${decision.variationKey}`)
  console.log(`[OPTIMIZELY] sort_method is ${decision.variables.sort_method}`)

  // Default response is products sorted alphabetically
  let res = NextResponse.rewrite('/')

  if (decision.variables.sort_method === 'popular_first') {
    res = NextResponse.rewrite('/popular')
  }
  
  if (!req.cookies[COOKIE_NAME]) {
    // Saving userId in the cookie so that the decision sticks for subsequent visits.
    res.cookie(COOKIE_NAME, userId)
  }

  return res;
}
