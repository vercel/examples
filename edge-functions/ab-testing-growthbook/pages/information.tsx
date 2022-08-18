import { Layout, Page, Text, Link, List, Snippet, Code } from '@vercel/examples-ui'

export default function Index() {
  return (
    <Page>
      <Text variant="h1" className="mb-6">
        A/B testing with GrowthBook and Next.js
      </Text>
      <Text className="mb-4">
        There are many ways to do A/B testing in a Next.js app.  This example
        uses Middleware to split traffic between two pages and uses cookies to ensure the
        same user always sees the same variation.
      </Text>
      <Text className="mb-4">
        There are two pages, <Code>pages/index.tsx</Code> (the existing homepage), and <Code>pages/new_homepage.tsx</Code>,
        the page we want to test.  In <Code>middleware.tsx</Code>, we use the GrowthBook SDK to randomly split traffic between these pages.
      </Text>
      <Text className="mb-4">
        GrowthBook uses Feature Flags to run experiments.  So, first we need to fetch the list of features from the GrowthBook API:
      </Text>
      <Snippet className="mb-4">{`import { NextRequest, NextResponse } from 'next/server'
import { GrowthBook } from '@growthbook/growthbook'

const FEATURES_ENDPOINT = process.env.FEATURES_ENDPOINT

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
}`}</Snippet>
      <Text className="mb-4">
        Then, we instantiate the GrowthBook instance, evaluate the feature flag, and route traffic depending on its value. 
        We also generate a unique visitor id and store it in a cookie so the user will continue receiving the same variation
        if they reload the app.
      </Text>
      <Snippet className="mb-4">
        {`export async function middleware(req: NextRequest) {
  // We only want to run the A/B test on the homepage
  const pathname = req.nextUrl.pathname
  if (pathname !== '/') {
    return NextResponse.next()
  }

  // Get existing visitor cookie or create a new one
  let visitor_id = req.cookies[COOKIE] || crypto.randomUUID()

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
  if (growthbook.feature('new-homepage').on) {
    const url = req.nextUrl.clone()
    url.pathname = '/new_homepage'
    res = NextResponse.rewrite(url)
  }

  // Store the visitor cookie if not already there
  if (!req.cookies[COOKIE]) {
    res.cookies.set(COOKIE, visitor_id)
  }

  return res
}`}
      </Snippet>
      <List>
        <li>
          <Link href="https://github.com/growthbook/growthbook">
            GrowthBook GitHub
          </Link>
        </li>
        <li>
          <Link href="https://www.growthbook.io/">GrowthBook Website</Link>
        </li>
      </List>
    </Page>
  )
}

Index.Layout = Layout
