import Head from 'next/head'
import {
  Layout,
  Text,
  Page,
  Button,
  Link,
  Snippet,
  Code,
} from '@vercel/examples-ui'
import { useRouter } from 'next/router'
import Cookie from 'js-cookie'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Statsig } from 'statsig-react'

interface Props {
  bucket: string
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  return {
    props: {
      bucket: params?.bucket as string,
    },
  }
}

export const getStaticPaths: GetStaticPaths<{ bucket: string }> = async () => {
  // Buckets that we want to statically generate
  const buckets: string[] = ['a', 'b']

  return {
    paths: buckets.map((bucket) => ({
      params: {
        bucket,
      },
    })),
    fallback: 'blocking',
  }
}

function BucketPage({ bucket }: Props) {
  const { reload } = useRouter()

  function resetBucket() {
    Cookie.remove('uid')
    Statsig.logEvent('reset-bucket')
    reload()
  }

  return (
    <Page className="flex flex-col gap-12">
      <Head>
        <title>AB testing with Statsig - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example how to use ab-testing-statsig"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">AB testing with Statsig</Text>
        <Text>
          In this demo we use Statsig&apos;s Edge SDK to pull experiment variant
          and show the resulting allocation. As long as you have a bucket
          assigned you will always see the same result, otherwise you will be
          assigned a bucket to mantain the odds in 50/50.
        </Text>
        <Text>
          Buckets are statically generated at build time in a{' '}
          <Code>/_bucket/[bucket]</Code> page so its fast to rewrite to them.
        </Text>
        <Snippet>{`import { NextRequest, NextResponse } from 'next/server'
import statsig from 'statsig-node'

// Store a cookie for the user
const UID_COOKIE = 'uid'

export async function middleware(req: NextRequest) {
  // Clone the URL
  const url = req.nextUrl.clone()

  // Prevent users from access buckets directly
  if (url.pathname.startsWith(\`/_bucket\`)) {
    url.pathname = '/404'

    return NextResponse.rewrite(url)
  }

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
  const experiment = await statsig.getExperiment({ userID }, 'half_bucket')

  // Get bucket from experiment
  const bucket = experiment.get('name', 'a')

  // Change the pathname to point to the correct bucket
  url.pathname = \`/_bucket/\${bucket}\`

  // Create a response
  const response = NextResponse.rewrite(url)

  // Set cookie if not present
  if (!req.cookies[UID_COOKIE]) {
    response.cookie(UID_COOKIE, userID)
  }

  // Return the response
  return response
}
`}</Snippet>
        <Text>
          You can reset the bucket multiple times to get a different bucket
          assigned. You can configure your experiments, see diagnostics and
          results in your account .
          <Link href="https://console.statsig.com/">Statsig console</Link>.
        </Text>
        <pre className="bg-black text-white font-mono text-left py-2 px-4 rounded-lg text-sm leading-6">
          bucket: {bucket}
        </pre>
        <Button size="lg" onClick={resetBucket}>
          Reset bucket
        </Button>

        <Text variant="h2">Using metrics in your experiments</Text>
        <Text>
          <Link href="https://docs.statsig.com/metrics">Statsig Metrics</Link>{' '}
          are a way to track events that happen in your site. To enable them you
          can can pass to{' '}
          <Link href="https://nextjs.org/docs/advanced-features/custom-app">
            <Code>_app.tsx</Code>
          </Link>{' '}
          the <Code>StatsigProvider</Code>.
        </Text>
        <Snippet>{`import Cookies from 'js-cookie'
import { StatsigProvider } from 'statsig-react'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)
  // middleware will automatically set a cookie for the user if they visit a page
  const userID = Cookies.get('uid')
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
          After we can tracks events by calling using the{' '}
          <Code>Statsig.logEvent</Code> function to track events during your
          experiments.
        </Text>
        <Snippet>{`import { Statsig } from 'statsig-react'

Statsig.logEvent('my-event')
`}</Snippet>
      </section>
    </Page>
  )
}

BucketPage.Layout = Layout

export default BucketPage
