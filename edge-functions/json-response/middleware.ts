import { NextRequest } from 'next/server'

export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  return new Response(JSON.stringify({ message: 'hello world!' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
