import type { NextFetchEvent, NextRequest } from 'next/server'
import cors from '../lib/cors'

export function middleware(ev: NextFetchEvent) {
  ev.respondWith(handler(ev.request))
}

async function handler(req: NextRequest) {
  // `cors` also takes care of handling OPTIONS requests
  return cors(
    req,
    new Response(JSON.stringify({ message: 'Hello World!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  )
}
