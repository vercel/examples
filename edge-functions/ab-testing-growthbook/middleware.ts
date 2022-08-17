import { NextRequest, NextResponse } from 'next/server'
import { GrowthBook } from '@growthbook/growthbook'
import { url } from 'inspector'

const FEATURES_ENDPOINT = process.env.FEATURES_ENDPOINT

//'http://localhost:3100/api/features/key_prod_29693a9e0fa369ed'

// Fetch features from GrowthBook API and cache in memory
let features = null
let lastFetch = 0
async function getFeatures() {
  if (Date.now() - lastFetch > 5000) {
    lastFetch = Date.now()
    const latest = fetch(FEATURES_ENDPOINT)
      .then((res) => res.json())
      .then((json) => (features = json.features || features))
      .catch((e) => console.error('Error fetching features', e))
    // If this is the first time, wait for the initial fetch
    if (!features) await latest
  }
  return features || {}
}

const COOKIE = 'visitor_id'

export async function middleware(req: NextRequest) {
  // We only want to run the A/B test on the homepage
  const pathname = req.nextUrl.pathname
  if (pathname !== '/') {
    return NextResponse.next()
  }

  // Get existing visitor cookie or create a new one
  let visitor_id = req.cookies[COOKIE] || crypto.randomUUID()
  console.log('visit', visitor_id)

  // Create a GrowthBook client instance
  const growthbook = new GrowthBook({
    attributes: { id: visitor_id },
    features: await getFeatures(),
    trackingCallback: (exp, res) => {
      console.log('In Experiment', exp.key, res.variationId)
    },
  })

  // Pick which page to render depending on a feature flag
  let res = NextResponse.next()
  if (growthbook.feature('new-homepage').on) {
    const url = req.nextUrl.clone()
    url.pathname = '/new_homepage'
    res = NextResponse.rewrite(url)
  }

  // Store the visitor cookie if not already there
  //console.log('cookies', res)
  if (!req.cookies[COOKIE]) {
    res.cookies.set(COOKIE, visitor_id)
  }

  return res
}
