import { NextRequest, NextResponse } from 'next/server'
import api from './api'

// Set pathname were middleware will be executed
export const config = {
  matcher: '/product/:path',
}

export async function middleware(req: NextRequest) {
  // Get the product id from the URL
  const url = req.nextUrl.clone()

  // Extract id from pathname
  const [, , id] = url.pathname.split('/')

  // Check on upstash if we have stock
  const hasStock = await api.cache.get(id)

  // Rewrite to the correct url
  url.pathname = hasStock ? `/product/${id}/` : `/product/${id}/no-stock`

  // Return rewrited path
  return NextResponse.rewrite(url)
}
