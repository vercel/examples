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
import { useEffect } from 'react'
import { UID_COOKIE } from '../lib/constants'
import api from '../lib/api'

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
  // Groups that we want to statically generate
  const groups: string[] = await api.getGroups()

  return {
    paths: groups.map((group) => ({
      params: {
        bucket: group,
      },
    })),
    fallback: 'blocking',
  }
}

function BucketPage({ bucket }: Props) {
  const { reload } = useRouter()

  function resetBucket() {
    Cookie.remove(UID_COOKIE)
    Statsig.logEvent('reset-bucket')
    reload()
  }

  useEffect(() => {
    // Log exposure to statsig
    api.logExposure(Cookie.get(UID_COOKIE)!, bucket, 'statsig_example')
  }, [bucket])

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
          In this demo we use Statsig&apos;s REST Api at the edge to pull
          experiment variants and show the resulting allocation. As long as you
          have a bucket assigned you will always see the same result, otherwise
          you will be assigned a bucket to mantain the odds specified in the
          experiment.
        </Text>
        <Text>
          Buckets are statically generated at build time in a{' '}
          <Code>/[bucket]</Code> page so its fast to rewrite to them.
        </Text>
        <Snippet>{`import { NextResponse } from 'next/server'
import statsig from '../lib/api'
import { UID_COOKIE } from '../lib/constants'

export async function middleware(req) {
  // Clone the URL
  const url = req.nextUrl.clone()

  // Just run for the / path
  if (req.nextUrl.pathname !== '/') {
    return NextResponse.next()
  }

  // Get users UID from the cookie
  let userID = req.cookies[UID_COOKIE]

  // Set a userID if not present
  if (!userID) {
    userID = crypto.randomUUID()
  }

  // Fetch experiment
  const bucket = await statsig.getExperiment({ userID }, 'statsig_example')

  // Change the pathname to point to the correct bucket
  url.pathname = \`/\${bucket}\`

  // Create a response
  const response = NextResponse.rewrite(url)

  // Set cookie if not present
  if (!req.cookies[UID_COOKIE]) {
    response.cookie(UID_COOKIE, userID)
  }

  // Return the response
  return response
}`}</Snippet>
        <Text>
          Once the page is fully functional, we have to log the exposure for the
          experiment, this will let Statsig know that the bucket was correctly
          assigned and the user has been exposed to the experiment. If we
          don&apos;t log the exposure, all users will get the same bucket and
          the traffic won&apos;t be split.
        </Text>
        <Snippet>{`import statsig from "../api"

...

useEffect(() => {
  // Log exposure to statsig
  api.logExposure(Cookie.get(UID_COOKIE), bucket, 'statsig_example')
}, [bucket])`}</Snippet>
        <Text className="text-gray-500 border-l-4 pl-2">
          Statsig REST Api calls were implemented in another file for sake of
          simplicity and exported as <Code>logExposure</Code> and{' '}
          <Code>getExperiment</Code> methods. You can find those{' '}
          <Link href="https://github.com/vercel/examples/tree/main/edge-functions/ab-testing-statsig/api.ts">
            here
          </Link>
          .
        </Text>
        <Text>
          You can reset the bucket multiple times to get a different bucket
          assigned. You can configure your experiments, see diagnostics and
          results in your account.{' '}
          <Link href="https://console.statsig.com/">Statsig console</Link>.
        </Text>
        <pre className="bg-black text-white font-mono text-left py-2 px-4 rounded-lg text-sm leading-6">
          bucket: {bucket}
        </pre>
        <Button size="lg" onClick={resetBucket}>
          Reset bucket
        </Button>
      </section>

      <section className="flex flex-col gap-6">
        <Text variant="h2">Using metrics in your experiments</Text>
        <Text>
          <Link href="https://docs.statsig.com/metrics">Statsig Metrics</Link>{' '}
          are a way to track events that happen in your site. To enable them you
          can pass the <Code>StatsigProvider</Code> to{' '}
          <Link href="https://nextjs.org/docs/advanced-features/custom-app">
            <Code>_app.tsx</Code>
          </Link>
          .
        </Text>
        <Snippet>{`import Cookies from 'js-cookie'
import { StatsigProvider } from 'statsig-react'

function App({ Component, pageProps }) {
  const Layout = getLayout(Component)

  // middleware will automatically set a cookie for the user if they visit a page
  const userID = Cookies.get(UID_COOKIE)

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
}`}</Snippet>
        <Text>
          After we can tracks events by calling using the{' '}
          <Code>Statsig.logEvent</Code> function to track events during your
          experiments.
        </Text>
        <Snippet>{`import { Statsig } from 'statsig-react';

...

export default function MyComponent() {
  return
    <Button
      onClick={() => {
        // this can be any event like adding an item to a cart or clicking a CTA button.
        Statsig.logEvent('button_clicked');
      }}
    />;
}`}</Snippet>
      </section>
    </Page>
  )
}

BucketPage.Layout = Layout

export default BucketPage
