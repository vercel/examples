import { NextResponse } from 'next/server'

export const config = {
  matcher: '/',
}

export function middleware() {
  return NextResponse.json({ message: 'hello world!' })
}
