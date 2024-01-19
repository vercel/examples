import { NextRequest } from 'next/server'
import RedirectsJson from '@/redirects/redirects.json'
import { Redirects } from '@/redirects/types'

export function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('pathname')
  if (!pathname) {
    return new Response('Bad Request', { status: 400 })
  }
  const redirect = (RedirectsJson as Redirects)[pathname]
  if (!redirect) {
    return new Response('No redirect', { status: 404 })
  }
  return new Response('', {
    status: redirect.permanent ? 301 : 302,
    headers: {
      Location: redirect.target,
    },
  })
}
