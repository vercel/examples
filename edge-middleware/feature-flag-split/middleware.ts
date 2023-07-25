/**
 * This middleware is only here to make sure your demo setup is correct.
 *
 * It would not be needed in a real application.
 */
import { NextRequest, NextResponse } from 'next/server'
import { has } from '@vercel/edge-config'

export const config = {
  matcher: ['/', '/about', '/marketing'],
}

export async function middleware(req: NextRequest) {
  if (!process.env.EDGE_CONFIG || !process.env.EDGE_CONFIG_SPLIT_ITEM_KEY) {
    req.nextUrl.pathname = `/missing-edge-config`
    return NextResponse.rewrite(req.nextUrl)
  }

  if (!(await has(process.env.EDGE_CONFIG_SPLIT_ITEM_KEY))) {
    req.nextUrl.pathname = `/missing-split-item`
    return NextResponse.rewrite(req.nextUrl)
  }
}
