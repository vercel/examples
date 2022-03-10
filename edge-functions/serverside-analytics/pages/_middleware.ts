import { NextFetchEvent, NextResponse, NextRequest } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/
const SEGMENT_PAGE_ENDPOINT = 'https://api.segment.io/v1/page'

function uuidv4() {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}

const logView = (userId: string, page: string) => {
  fetch(SEGMENT_PAGE_ENDPOINT, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      anonymousId: userId,
      writeKey: process.env.SEGMENT_WRITE_KEY,
      name: page,
    }),
    method: 'POST',
  })
}

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const response = NextResponse.next()

  // we need to skip some request to ensure we are on a proper page view
  const isPageRequest =
    !PUBLIC_FILE.test(req.nextUrl.pathname) &&
    !req.nextUrl.pathname.startsWith('/api') &&
    // headers added when next/link pre-fetches a route
    !req.headers.get('x-middleware-preflight')

  if (isPageRequest) {
    // if it's a first time user, we'll add cookie to identify it in subsequent requests
    const userId = req.cookies['userId'] || uuidv4()

    // setting a cookie to identify the user on future requests
    if (!req.cookies['userId']) {
      response.cookie('userId', userId)
    }

    console.log(`User ${userId} is visiting ${req.nextUrl.pathname}`)
    // non blocking call to let the middleware finish quickly
    logView(userId, req.nextUrl.pathname)
  }
  return response
}
