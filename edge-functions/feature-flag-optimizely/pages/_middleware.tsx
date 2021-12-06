import { NextRequest, NextFetchEvent, NextResponse } from "next/server";
import { createInstance } from '@optimizely/optimizely-sdk/dist/optimizely.lite.min.js';

import optimizelyDatafile from '../lib/optimizely/datafile';

const COOKIE_NAME = 'optimizely_visitor_id';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (!req.page.name) {
    return NextResponse.next()
  }

  const userId = req.cookies[COOKIE_NAME] || Math.floor(Math.random() * 899999 + 100000) as unknown as string;  
  const instance = createInstance({ datafile: optimizelyDatafile });
  const uc = instance.createUserContext(userId.toString());
  const decision = uc.decide('product_sort');
  const revision = instance.getOptimizelyConfig().revision;
  
  console.log(`[OPTIMIZELY] Datafile Revision: ${revision}`);
  console.log(`[OPTIMIZELY] userId: ${userId}`);
  console.log(`[OPTIMIZELY] flag 'product_sort' is ${decision.enabled}`);
  console.log(`[OPTIMIZELY] variationKey is ${decision.variationKey}`);
  console.log(`[OPTIMIZELY] sort_method is ${decision.variables.sort_method}`);

  let res = NextResponse.rewrite('/'); 

  if (decision.variables.sort_method === 'popular_first') {
    res = NextResponse.rewrite('/popular')
  }
  
  if (!req.cookies[COOKIE_NAME]) {
    //saving userId in the cookie so that the decision sticks on subsequent visits.
    res.cookie(COOKIE_NAME, userId);
  }

  return res;
}
