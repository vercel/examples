import type { NextFetchEvent, NextRequest } from 'next/server'

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  return new Response('Hello, world!')
}
