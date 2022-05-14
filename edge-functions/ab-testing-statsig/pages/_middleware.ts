import { NextRequest, NextResponse } from 'next/server'
import statsig from '../lib/api'
import { DEFAULT_GROUP, UID_COOKIE } from '../lib/constants'

export async function middleware(req: NextRequest) {
  // If the request is not for `/`, continue
  if (req.nextUrl.pathname !== '/') return NextResponse.next()

  // Get users UID from the cookie
  let userID = req.cookies[UID_COOKIE]

  // Set a userID if not present
  if (!userID) userID = crypto.randomUUID()

  // Fetch experiment from Statsig
  const bucket =
    (await statsig.getExperiment(userID, 'statsig_example').catch((error) => {
      // Log the error but don't throw it, if Statsig fails, fallback to the default group
      // so that the site doesn't go down
      console.error(error)
    })) || DEFAULT_GROUP

  // Clone the URL and change its pathname to point to a bucket
  const url = req.nextUrl.clone()
  url.pathname = `/${bucket}`

  // Response that'll rewrite to the selected bucket
  const response = NextResponse.rewrite(url)

  // Set cookie if not present
  if (!req.cookies[UID_COOKIE]) {
    response.cookie(UID_COOKIE, userID)
  }

  // Return the response
  return response
}
