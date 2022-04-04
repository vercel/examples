import Head from 'next/head'
import { Layout, Text, Page, Code, Link, Snippet } from '@vercel/examples-ui'
import { ProductCard } from '../components/ProductCard'

const product = {
  id: 'mug',
  title: 'Vercel Mug',
  description: 'Limited edition',
  price: 15,
  stock: 1,
}

function Home() {
  return (
    <Page>
      <Head>
        <title>Statsig Metrics - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example how to use Statsig Metrics"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">Statsig Metrics example</Text>
        <Text>
          <Link href="https://docs.statsig.com/metrics">Statsig Metrics</Link>{' '}
          are used to quantify and measure feature flags and experiments. We can
          use metrics to gather information about the popularity of an item.
        </Text>
        <ProductCard product={product} />
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        <Text variant="h2">How this works</Text>
        <Text>
          Statsig offers libraries for both React and Node.js. This allows you
          to create metrics for events that happen both on your client and
          server. To work with Statsig metrics we need first to generate an ID
          for each user visiting our site. We&aposll do this from a{' '}
          <Code>
            <Link href="https://nextjs.org/docs/middleware">Middleware</Link>
          </Code>{' '}
          function by assigning a cookie to each users.
        </Text>
        <Snippet>
          {`
import { NextResponse, NextRequest } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export function middleware(req: NextRequest) {
  const response = NextResponse.next()

  // avoid public files such as images and api requests
  const isPageRequest =
    !PUBLIC_FILE.test(req.nextUrl.pathname) &&
    !req.nextUrl.pathname.startsWith('/api')

  // when a user visits a page we set a cookie to identify the user
  if (isPageRequest) {
    const userId = req.cookies['userId'] || crypto.randomUUID!()

    // if the user doesn't have a cookie we set one otherwise they are returning users
    if (!req.cookies['userId']) {
      response.cookie('userId', userId)
    }
  }

  // the response will go through unmodified as we just need to set the cookie
  return response
}
`}
        </Snippet>
        <Text variant="h2">Creating evants to track metrics</Text>
        <Text>
          Once we have identified our users we will pass inside our custom
          <Link href="https://nextjs.org/docs/advanced-features/custom-app">
            <Code>_app.tsx</Code>
          </Link>
          file a <Code>StatsigProvider</Code> and pass it the user cookie.
        </Text>
        <Snippet>{`
import Cookies from 'js-cookie'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  // middleware will automatically set a cookie for the user if they visit a page
  const userID = Cookies.get('userId')

  return (
    <StatsigProvider
      sdkKey={process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!}
      waitForInitialization={true}
      user={{ userID }}
    >
      <Layout title="statsig-metric" path="solutions/statsig-metric">
        <Component {...pageProps} />
      </Layout>
    </StatsigProvider>
  )
}
`}</Snippet>
        <Text>
          After we can tracks events by using the <Code>Statsig.logEvent</Code>{' '}
          function.
        </Text>
        <Snippet>{`
import { Statsig } from 'statsig-react';

const handleAddToCart = () => {
  setAdded(true)
  // Non blocking call to ensure the UX stays good
  Statsig.logEvent('mug-added-to-cart')
}

const handleRemoveFromCart = () => {
  setAdded(false)
  // Non blocking call to ensure the UX stays good
  Statsig.logEvent('mug-removed-from-cart')
}
`}</Snippet>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
