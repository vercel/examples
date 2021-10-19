import { NextRequest } from 'next/server'
import { upstashEdge } from './upstash'
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
  const { pathname } = req.nextUrl
  let start = Date.now()

  // Find the redirect from the local JSON file, do note this JSON shouldn't be
  // large, as the space in Edge Functions is quite limited
  const localRedirect = (redirectsJson as LocalRedirects)[pathname]
  if (localRedirect) {
    return Response.redirect(
      `${localRedirect.destination}?l=${Date.now() - start}`
    )
  }

  start = Date.now()

  const { result } = await upstashEdge([
    'HGET',
    'redirects',
    encodeURIComponent(encodeURIComponent(pathname)),
  ])

  if (result) {
    const redirect = JSON.parse(result)
    return Response.redirect(`${redirect.destination}?l=${Date.now() - start}`)
  }
}
