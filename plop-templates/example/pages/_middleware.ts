import type { NextFetchEvent, NextRequest } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  // Only rewrite files that don't have a file extension
  if (!PUBLIC_FILE.test(req.nextUrl.pathname)) {
    return new Response('Hello world from pages/_middleware.ts')
  }
}
