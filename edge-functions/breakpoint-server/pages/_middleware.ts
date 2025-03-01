import { NextRequest, NextResponse } from 'next/server'
import MobileDetect from 'mobile-detect'
import { Breakpoint, BreakpointServer } from '../config/breakpoints'

const PUBLIC_FILE = /\.(.*)$/

const getViewportFromUserAgent = (
  userAgent: string | null
): BreakpointServer => {
  if (!userAgent) {
    return Breakpoint.lg
  }

  const device = new MobileDetect(userAgent)

  const isMobile = device.mobile()
  const isTablet = device.tablet()

  if (isMobile && !isTablet) {
    // Our "xs" viewport is given for phones our Tenants do not really support since they are below the 1% from phones section, so our best bet is to handle phones like they are "sm"
    return Breakpoint.sm
  }

  if (isTablet) {
    // we understand they can be rotated etc, once again best educated guess
    return Breakpoint.md
  }

  // Most phones will be detected by us, just proceed with desktop version when we can't else it makes it weird for the non mobile users
  return Breakpoint.lg
}

export function middleware(req: NextRequest) {
  const breakpoint = getViewportFromUserAgent(req.headers.get('user-agent'))

  // Only rewrite files that don't have a file extension
  if (!PUBLIC_FILE.test(req.nextUrl.pathname)) {
    req.nextUrl.pathname = `/${breakpoint}`
    return NextResponse.rewrite(req.nextUrl)
  }
}
