import { Text, Code, Link } from '@vercel/examples-ui'

import { FC } from 'react'
import { useRouter } from 'next/router'

const Snippet: FC = ({ children }) => {
  return (
    <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 transition-all">
      {children}
    </pre>
  )
}

export const Screen = () => {
  const router = useRouter()

  return (
    <section className="flex flex-col gap-6">
      <Text variant="h1">Serverside Analytics usage example</Text>
      <Text>
        Analytics are a great way to track user behavior and usage of your app.
        However, the most popular analytics scripts are often blocked by privacy
        minded browsers and extensions.{' '}
        <Link href="https://nextjs.org/docs/middleware">
          Next.js Middleware
        </Link>{' '}
        provides a great way to still track page views and other important
        metrics since it will run on the server.
      </Text>
      <Text variant="h2">Setup</Text>
      <Text>
        We should create our <Code>_middleware.ts</Code> file at the root of the{' '}
        <Code>Pages</Code> folder. This will ensure it runs on every request for
        a page. In our example, we are using a <Code>logView</Code> function.
        This function will be called to register a page view in your analytics
        provider. In our case we are using{' '}
        <Link href="https://segment.com/">Segment.io</Link> and are connecting
        it to{' '}
        <Link href="https://support.google.com/analytics/answer/10089681?hl=en">
          Google Analytics V4
        </Link>
        . Let&lsquos explore a little bit this function:
      </Text>
      <Snippet>{`const logView = (userId: string, page: string) => {
  fetch(SEGMENT_PAGE_ENDPOINT, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      anonymousId: userId,
      writeKey: Process.env.SEGMENT_WRITE_KEY,
      name: page,
    }),
    method: 'POST',
  })
}     
     `}</Snippet>
      <Text>
        As we can see, nothing fancy. The most important aspect of this function
        is that it is not awaiting any promises. This is important because we
        want our middleware function to run on every request but we don&lsquot
        want it to slow the user experience.
      </Text>
      <Text variant="h2">Middleware code</Text>

      <Snippet>
        {`const PUBLIC_FILE = /\.(.*)$/

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const response = NextResponse.next()

  // we need to skip some request to ensure we are on a proper page view
  const isPageRequest =
    !PUBLIC_FILE.test(req.nextUrl.pathname) &&
    !req.nextUrl.pathname.startsWith('/api') &&
    // headers added when next/link pre fetches a route
    !req.headers.get('x-middleware-preflight')

  if (isPageRequest) {
    // if it's a first time user, we'll add cookie to identify it in subsequent requests
    const userId = req.cookies['userId'] || uuidv4()

    // setting a cookie to identify the user on future requests
    if (!req.cookies['userId']) {
      response.cookie('userId', userId)
    }

    // non blocking call to let the middlware finish quickly
    logView(userId, req.nextUrl.pathname)
  }
  return response        
        `}
      </Snippet>

      <Text>
        A few things are going on here. First we are making sure to only log
        server page requests. This regex, <Code>/\.(.*)$/</Code> will allow us
        to skip assets being requested such as images. Another important part is
        that we will skip the pages that are being prefetched by{' '}
        <Link href="https://nextjs.org/docs/api-reference/next/link">
          Next/Link
        </Link>{' '}
        by skipping the <Code>x-middleware-preflight</Code> header. This
        implementation should be flexible enough to work with any analytics
        provider that provides an api endpoint.
      </Text>
    </section>
  )
}
