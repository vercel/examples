import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Clone the request headers
  // You can modify them with headers API: https://developer.mozilla.org/en-US/docs/Web/API/Headers 
  const requestHeaders = new Headers(request.headers)

  // Add new request headers
  requestHeaders.set('x-hello-from-middleware1', 'hello')
  requestHeaders.set('x-hello-from-middleware2', 'world!')

  // Update an existing request header
  requestHeaders.set('user-agent', 'New User Agent overriden by middleware!')

  // Delete an existing request header
  requestHeaders.delete('x-from-client')
  
  // You can also set request headers in NextResponse.rewrite
  return NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  })
}
