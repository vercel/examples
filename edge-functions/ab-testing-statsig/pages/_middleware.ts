import { NextRequest, NextResponse } from 'next/server'
import statsig from 'statsig-node' // This library also works in a V8 environment

// Store a cookie for the user
const UID_COOKIE = 'uid'

export async function middleware(req: NextRequest) {
  // Clone the URL
  const url = req.nextUrl.clone()

  // Just run for the / path
  if (req.nextUrl.pathname !== '/') {
    return NextResponse.next()
  }

  // Initialize statsig client
  await statsig.initialize(process.env.STATSIG_SERVER_API_KEY as string)

  // Get users UID from the cookie
  let userID = req.cookies[UID_COOKIE]

  // Set a userID if not present
  if (!userID) {
    userID = crypto.randomUUID()
  }

  // Fetch experiment
  const experiment = await statsig.getExperiment({ userID }, 'new_homepage')

  // Get bucket from experiment
  const bucket = experiment.get('name', 'a')

  // Change the pathname to point to the correct bucket
  url.pathname = `/${bucket}`

  // Create a response
  const response = NextResponse.rewrite(url)

  // Set cookie if not present
  if (!req.cookies[UID_COOKIE]) {
    response.cookie(UID_COOKIE, userID)
  }

  // Return the response
  return response
}
