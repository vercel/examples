import { NextResponse } from 'next/server'

export function middleware() {
  // Store the response so we can modify its headers
  const response = NextResponse.next()

  // Set custom header
  response.headers.set('x-modified-edge', 'true')

  // Return response
  return response
}
