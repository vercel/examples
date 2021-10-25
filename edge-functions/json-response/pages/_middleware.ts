import type { NextFetchEvent } from 'next/server'

export function middleware(ev: NextFetchEvent) {
  ev.respondWith(
    new Response(JSON.stringify({ message: 'hello world!' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  )
}
