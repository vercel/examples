import type { NextRequest } from 'next/server'
import cors from '../lib/cors'

export function middleware(req: NextRequest) {
  // `cors` also takes care of handling OPTIONS requests
  return cors(
    req,
    new Response(JSON.stringify({ message: 'Hello World!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  )
}
