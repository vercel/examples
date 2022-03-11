import type { FC } from 'react'
import Head from 'next/head'
import { Layout, Page, Text, Code, Link } from '@vercel/examples-ui'

const Snippet: FC = ({ children }) => {
  return (
    <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 transition-all">
      {children}
    </pre>
  )
}

const Home = () => (
  <Page>
    <Head>
      <title>Analytics at the edge</title>
      <meta
        name="description"
        content="Learn how to do analytics at the edge"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <section className="flex flex-col gap-6">
      <Text variant="h1">Analytics at the edge</Text>
      <Text>
        Analytics are a great way to track user behavior and usage of your app.
        However, the most popular analytics scripts are often blocked by privacy
        minded browsers and extensions.{' '}
        <Link href="https://nextjs.org/docs/middleware">
          Next.js Middleware
        </Link>{' '}
        provides a great way to still track page views and other important
        metrics directly from the edge.
      </Text>
      <Text variant="h2">Setup</Text>
      <Text>
        Start by creating the <Code>pages/_middleware.ts</Code> file. It&apos;s
        at the root of <Code>pages</Code> to ensure it runs on every page
        request.
      </Text>
      <Text>
        We have a <Code>logView</Code> function that will be called to register
        a page view in your analytics provider, which in our case is using{' '}
        <Link href="https://segment.com/" target="_blank">
          Segment.io
        </Link>
        :
      </Text>
      <Snippet>{`const SEGMENT_PAGE_ENDPOINT = 'https://api.segment.io/v1/page'

const logView = (userId: string, page: string) =>
  fetch(SEGMENT_PAGE_ENDPOINT, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      anonymousId: userId,
      writeKey: process.env.SEGMENT_WRITE_KEY,
      name: page,
    }),
    method: 'POST',
  }).catch((error) => {
    console.log('An error happened trying to reach Segment:', error)
  })`}</Snippet>
      <Text>Now, let&apos;s use it inside our middleware handler:</Text>

      <Snippet>
        {`import { NextResponse, NextRequest } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export function middleware(req: NextRequest) {
  const response = NextResponse.next()

  // we need to skip some request to ensure we are on a proper page view
  const isPageRequest =
    !PUBLIC_FILE.test(req.nextUrl.pathname) &&
    !req.nextUrl.pathname.startsWith('/api') &&
    // header added when next/link pre-fetches a route
    !req.headers.get('x-middleware-preflight')

  if (isPageRequest) {
    // if it's a first time user, we'll add cookie to identify it in subsequent requests
    const userId = req.cookies['userId'] || uuidv4()

    // setting a cookie to identify the user on future requests
    if (!req.cookies['userId']) {
      response.cookie('userId', userId)
    }

    // non blocking call to let the middleware finish quickly
    logView(userId, req.nextUrl.pathname)
  }
  return response
}`}
      </Snippet>

      <Text>
        The middleware will send a log to Segment whenever a request isn&apos;t
        for a public file (images, favicon, etc) or if it&apos;s not a preflight
        request, which are made by the prefetching of{' '}
        <Link
          href="https://nextjs.org/docs/api-reference/next/link"
          target="_blank"
        >
          next/link
        </Link>
        .
      </Text>
      <Text>
        Note that the <Code>logView</Code> function isn&apos;t being called
        using <Code>await</Code>, this is intentional because we don&apos;t want
        to block the request or introduce latency to the response. You can also
        use other analytics providers besides Segment.
      </Text>
    </section>
  </Page>
)

Home.Layout = Layout

export default Home
