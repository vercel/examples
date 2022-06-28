import { NextRequest, NextResponse } from 'next/server'
import statsig from './lib/statsig-api'
import { DEFAULT_GROUP, FLAG, UID_COOKIE } from './lib/constants'

// We'll use this to validate a random UUID
const IS_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{16}$/i

export async function middleware(req: NextRequest) {
  // If the request is not for `/`, continue
  if (req.nextUrl.pathname !== '/') return

  // Get the user ID from the cookie or get a new one
  let userId = req.cookies.get(UID_COOKIE)
  let hasUserId = !!userId

  // If there's no active user ID in cookies or its value is invalid, get a new one
  if (!userId || !IS_UUID.test(userId)) {
    userId = crypto.randomUUID()
    hasUserId = false
  }

  // Fetch experiment from Statsig
  const bucket =
    (await statsig
      .getExperiment(userId, FLAG)
      .then((value) => value.name)
      .catch((error) => {
        // Log the error but don't throw it, if Statsig fails, fallback to the default group
        // so that the site doesn't go down
        console.error(error)
      })) || DEFAULT_GROUP

  // Clone the URL and change its pathname to point to a bucket
  const url = req.nextUrl.clone()
  url.pathname = `/${bucket}`

  // Response that'll rewrite to the selected bucket
  const res = NextResponse.rewrite(url)

  // Add the user ID to the response cookies if it's not there or if its value was invalid
  if (!hasUserId) {
    res.cookies.set(UID_COOKIE, userId)
  }

  return res
}
