import { NextRequest, NextResponse } from 'next/server'
// `statsig-node` also works in the V8 environment of Edge Functions
import statsig from 'statsig-node'

// Store a cookie for the user
const UID_COOKIE = 'uid'

export async function middleware(req: NextRequest) {
  // Clone the URL
  const url = req.nextUrl.clone()

  // test
  if (req.nextUrl.pathname !== '/') {
    return NextResponse.next()
  }

  // Initialize the statsig client, rules are fetched in this step
  // and saved in memory for reuse in subsequent requests
  await statsig.initialize(process.env.STATSIG_SERVER_API_KEY as string, {
    // We only want to wait at a max 300ms for statsig to respond
    initTimeoutMs: 300,
  })

  // Get users UID from the cookie
  let userID = req.cookies[UID_COOKIE]

  // Set a userID if not present
  if (!userID) {
    userID = crypto.randomUUID()
  }

  // Get the experiment from statsig
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
