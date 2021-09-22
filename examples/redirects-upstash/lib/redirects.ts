import type { EdgeRequest, EdgeResponse } from 'next'
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

export default async function redirects(req: EdgeRequest, res: EdgeResponse) {
  const pathname = req.url?.pathname
  let start = Date.now()

  if (pathname) {
    const localRedirect = (redirectsJson as LocalRedirects)[pathname]

    if (localRedirect) {
      res.redirect(`${localRedirect.destination}?l=${Date.now() - start}`)
      return true
    }

    start = Date.now()

    const value = await upstashEdge(
      'HGET',
      'redirects',
      encodeURIComponent(encodeURIComponent(pathname))
    )

    if (value) {
      const redirect = JSON.parse(value)

      res.redirect(`${redirect.destination}?l=${Date.now() - start}`)
      return true
    }
  }

  return false
}
