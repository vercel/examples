import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  return new Response(JSON.stringify({ message: 'hello world!' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
