import { NextRequest, NextResponse } from 'next/server'
import api from './api'

export const config = {
  matcher: '/product/:path',
}

export async function middleware(req: NextRequest) {
  // Extract id from pathname
  const [, , id] = req.nextUrl.pathname.split('/')

  // Check on upstash if we have stock
  const hasStock = await api.cache.get(id)

  // Rewrite to the correct url
  req.nextUrl.pathname = hasStock
    ? `/product/${id}/`
    : `/product/${id}/no-stock`

  // Return rewrited path
  return NextResponse.rewrite(req.nextUrl)
}
