import { NextRequest, NextResponse } from 'next/server'
import { GrowthBook } from '@growthbook/growthbook'

const FEATURES_ENDPOINT = process.env.FEATURES_ENDPOINT || ''

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

  if (!FEATURES_ENDPOINT) {
    throw new Error('Missing FEATURES_ENDPOINT environment variable')
  }

  // Get existing visitor cookie or create a new one
  let visitor_id = req.cookies.get(COOKIE) || crypto.randomUUID()

  // Create a GrowthBook client instance
  const growthbook = new GrowthBook({
    attributes: { id: visitor_id },
    features: await getFeatures(),
    trackingCallback: (exp, res) => {
      // TODO: log with your analytics system (Segment, Mixpanel, etc.)
      console.log('In Experiment', exp.key, res.variationId)
    },
  })

  // Pick which page to render depending on a feature flag
  let res = NextResponse.next()
  const newHomepageFeature = growthbook.evalFeature('new-homepage')

  // If it's not using the experiment for whatever reason, show a debugging page
  // NOTE: this is only here to help debug the demo
  if (newHomepageFeature.source !== 'experiment') {
    console.error('---- ERROR ----')
    if (newHomepageFeature.source === 'unknownFeature') {
      console.error("Could not find feature 'new-homepage'")
      if (features && Object.keys(features).length > 0) {
        console.error(
          'Found the following features instead: ',
          Object.keys(features)
        )
      } else {
        console.error('No features loaded from ', FEATURES_ENDPOINT)
      }
    } else {
      console.error(
        "Feature 'new-homepage' found, but did not use an experiment rule"
      )
      console.error('Used the following instead: ', newHomepageFeature.source)
      console.error(
        'Feature definition: ',
        JSON.stringify(features?.['new-homepage'], null, 2)
      )
    }

    const url = req.nextUrl.clone()
    url.pathname = '/debugging'
    res = NextResponse.rewrite(url)
  }

  // If the new homepage is selected, use it
  else if (newHomepageFeature.on) {
    const url = req.nextUrl.clone()
    url.pathname = '/new_homepage'
    res = NextResponse.rewrite(url)
  }

  // Store the visitor cookie if not already there
  if (!req.cookies.has(COOKIE)) {
    res.cookies.set(COOKIE, visitor_id)
  }

  return res
}
