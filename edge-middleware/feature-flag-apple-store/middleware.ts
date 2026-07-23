import { NextRequest, NextResponse } from 'next/server'
import { get } from 'lib/feature-flags'
import { parseConnectionString } from '@vercel/global-config'

export const config = {
  matcher: '/',
}

export async function middleware(req: NextRequest) {
  // for demo purposes, warn when there is no EDGE_CONFIG
  if (
    !process.env.EDGE_CONFIG ||
    !parseConnectionString(process.env.EDGE_CONFIG)
  ) {
    req.nextUrl.pathname = '/missing-global-config'
    return NextResponse.rewrite(req.nextUrl)
  }

  try {
    if (await get('storeClosed')) {
      req.nextUrl.pathname = `/_closed`
      return NextResponse.rewrite(req.nextUrl)
    }
  } catch (error) {
    console.error(error)
  }
}
