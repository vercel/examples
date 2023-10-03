import { NextRequest, NextResponse } from 'next/server'
import { upstashRest } from './upstash'
import redirectsJson from './redirects.json'

type LocalRedirects = {
  [k: string]:
    | {
        destination: string
        permanent: boolean
      }
    | undefined
}

export default async function redirects(req: NextRequest) {
  const url = req.nextUrl
  let start = Date.now()

  // Check if path is only numbers (e.g: /200)
  const isNumberPath = /^\/[0-9]*$/.test(url.pathname)

  // If it isn't we just skip the redirect
  if (!isNumberPath) {
    return
  }

  // Find the redirect from the local JSON file, do note this JSON shouldn't be
  // large, as the space in Edge Middleware is quite limited
  const localRedirect = (redirectsJson as LocalRedirects)[url.pathname]
  if (localRedirect) {
    url.pathname = localRedirect.destination
    url.searchParams.set('l', `${Date.now() - start}`)
    return NextResponse.redirect(url)
  }

  start = Date.now()

  const { result } = await upstashRest([
    'HGET',
    'redirects',
    encodeURIComponent(url.pathname),
  ])

  if (result) {
    const redirect = JSON.parse(result)
    url.pathname = redirect.destination
    url.searchParams.set('l', `${Date.now() - start}`)
    return NextResponse.redirect(url)
  }
}
