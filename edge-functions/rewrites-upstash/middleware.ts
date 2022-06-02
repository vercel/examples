import { NextRequest, NextResponse } from 'next/server'
import api from './api'

// RegExp for public files
const PUBLIC_FILE = /\.(.*)$/

// RegExp for public files
const NEXT_FILES = /^\/_next\//

// RegExp for match path
const MATCHED_PATHS = /^\/product\//

// Set pathname were middleware will be executed
export const config = {
  pathname: '/product',
}

export async function middleware(req: NextRequest) {
  // Get the product id from the URL
  const url = req.nextUrl.clone()

  // Skip public files
  if (
    PUBLIC_FILE.test(url.href) ||
    NEXT_FILES.test(url.href) ||
    !MATCHED_PATHS.test(url.pathname)
  )
    return NextResponse.next()

  // Extract id from pathname
  const [, , id] = url.pathname.split('/')

  // Check on upstash if we have stock
  const hasStock = await api.cache.get(id)

  // Rewrite to the correct url
  url.pathname = hasStock ? `/product/${id}/` : `/product/${id}/no-stock`

  // Return rewrited path
  return NextResponse.rewrite(url)
}
