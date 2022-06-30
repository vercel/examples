import { useEffect } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { Statsig } from 'statsig-react'
import Cookie from 'js-cookie'
import {
  Layout,
  Text,
  Page,
  Button,
  Link,
  Snippet,
  Code,
} from '@vercel/examples-ui'
import { FLAG, UID_COOKIE } from '../lib/constants'
import api from '../lib/statsig-api'

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
    api.logExposure(Cookie.get(UID_COOKIE)!, bucket, FLAG)
  }, [bucket])

  return (
    <Page className="flex flex-col gap-12">
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
import statsig from '../lib/statsig-api'
import { UID_COOKIE } from '../lib/constants'

export async function middleware(req) {
  // If the request is not for \`/\`, continue
  if (req.nextUrl.pathname !== '/') return NextResponse.next()

  // Get users UID from the cookie
  let userID = req.cookies[UID_COOKIE]

  // Set a userID if not present
  if (!userID) userID = crypto.randomUUID()

  // Fetch experiment from Statsig
  const bucket =
    (await statsig.getExperiment(userID, FLAG).catch((error) => {
      // Log the error but don't throw it, if Statsig fails, fallback to the default group
      // so that the site doesn't go down
      console.error(error)
    })) || DEFAULT_GROUP

  // Clone the URL and change its pathname to point to a bucket
  const url = req.nextUrl.clone()
  url.pathname = \`/${bucket}\`

  // Response that'll rewrite to the selected bucket
  const response = NextResponse.rewrite(url)

  // Set cookie if not present
  if (!req.cookies[UID_COOKIE]) {
    response.cookie(UID_COOKIE, userID)
  }

  // Return the response
  return response
}`}</Snippet>
        <Text>
          Once the page is fully functional we log the exposure for the
          experiment, this will let Statsig know that the bucket was correctly
          assigned and the user has been exposed to the experiment. If we
          don&apos;t log the exposure, Statsig won&apos;t be able to analyze and
          track the progress of the experiment.
        </Text>
        <Snippet>{`import statsig from '../lib/statsig-api'

...

useEffect(() => {
  // Log exposure to statsig
  api.logExposure(Cookie.get(UID_COOKIE), bucket, FLAG)
}, [bucket])`}</Snippet>
        <Text>
          You can reset the bucket multiple times to get a different bucket
          assigned. You can configure your experiments, see diagnostics and
          results in your account.{' '}
          <Link href="https://console.statsig.com/" target="_blank">
            Statsig console
          </Link>
          .
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
          <Link href="https://docs.statsig.com/metrics" target="_blank">
            Statsig Metrics
          </Link>{' '}
          are a way to track events that happen in your site. One way to enable
          them is to pass the <Code>StatsigProvider</Code> to{' '}
          <Link
            href="https://nextjs.org/docs/advanced-features/custom-app"
            target="_blank"
          >
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
          Now we can tracks events by calling using the{' '}
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
