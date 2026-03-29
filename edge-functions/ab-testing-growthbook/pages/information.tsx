import {
  Layout,
  Page,
  Text,
  Link,
  List,
  Snippet,
  Code,
} from '@vercel/examples-ui'

export default function Index() {
  return (
    <Page>
      <Text variant="h1" className="mb-6">
        A/B testing with GrowthBook
      </Text>
      <Text className="mb-4">
        <Link href="/">←Back to the demo</Link>
      </Text>
      <Text className="mb-4">
        There are many ways to do A/B testing in a Next.js app. This example
        uses Middleware to split traffic between two pages at the edge. It also
        uses cookies to ensure the same user always sees the same variation.
      </Text>
      <Text className="mb-4">
        By A/B testing at the edge, you&apos;ll reduce CLS from client-loaded
        experiments and improve your site&apos;s performance with smaller JS
        bundles.
      </Text>
      <Text variant="h2" className="mb-4">
        App Setup
      </Text>
      <Text className="mb-4">There are two main pages:</Text>
      <List className="mb-4">
        <li>
          <Code>pages/index.tsx</Code>, the existing homepage
        </li>
        <li>
          <Code>pages/new_homepage.tsx</Code>, the new page we want to test
        </li>
      </List>
      <Text className="mb-4">
        We want to run an A/B test where 50% of users who visit the homepage (
        <Code>/</Code>) will be served the new version instead of the original.
        We do this at the edge using Next.js Middleware.
      </Text>
      <Text variant="h2" className="mb-4">
        Middleware
      </Text>
      <Text className="mb-4">
        In <Code>middleware.tsx</Code>, we use the GrowthBook SDK to randomly
        split traffic between these pages.
      </Text>
      <Text className="mb-4">
        GrowthBook uses Feature Flags to run experiments. So, first we need to
        fetch the list of features from the GrowthBook API:
      </Text>
      <Snippet className="mb-4">
        {`import { NextRequest, NextResponse } from 'next/server'
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
}`}
      </Snippet>
      <Text className="mb-4">
        Then, we instantiate the GrowthBook instance, evaluate the feature flag,
        and route traffic depending on its value. We also generate a unique
        visitor id and store it in a cookie so the user will continue receiving
        the same variation if they reload the app.
      </Text>
      <Snippet className="mb-4">
        {`export async function middleware(req: NextRequest) {
  // We only want to run the A/B test on the homepage
  const pathname = req.nextUrl.pathname
  if (pathname !== '/') {
    return NextResponse.next()
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
  if (growthbook.isOn('new-homepage')) {
    const url = req.nextUrl.clone()
    url.pathname = '/new_homepage'
    res = NextResponse.rewrite(url)
  }

  // Store the visitor cookie if not already there
  if (!req.cookies.has(COOKIE)) {
    res.cookies.set(COOKIE, visitor_id)
  }

  return res
}`}
      </Snippet>
      <Text variant="h2" className="mb-4">
        Links and Further Reading
      </Text>
      <List>
        <li className="mb-2">
          GitHub Repo -{' '}
          <Link href="https://github.com/growthbook/growthbook">
            github.com/growthbook/growthbook →
          </Link>
        </li>
        <li className="mb-2">
          Documentation -{' '}
          <Link href="https://docs.growthbook.io/">docs.growthbook.io →</Link>
        </li>
        <li className="mb-2">
          Website -{' '}
          <Link href="https://www.growthbook.io/">www.growthbook.io →</Link>
        </li>
      </List>
    </Page>
  )
}

Index.Layout = Layout
