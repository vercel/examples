import Head from 'next/head'
import Image from 'next/image'
import { Layout, Text, Page, Code, Link, Snippet } from '@vercel/examples-ui'

import board from '../public/board.jpg'

function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <Head>
        <title>Maintenance page - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example how to implement a maintenance page on the edge"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">Maintenance page usage example</Text>
        <Text>
          When we do a release, promotion, event, etc. That might bring more
          attention than usual to a page; Its a good idea to have a backup plan
          that includes showing a different page to the users in case something
          fails. If this page receives a lot of traffic, we can use the edge, a
          previously generated static page and a redis cache to give the users,
          dynamic at the speed of static.
        </Text>
        <Image src={board} alt="Graph showing how to use middleware" />
        <Text>
          This will let us change the flow of the traffic quickly in case
          something fails.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">How to do it?</Text>
        <Text>
          You can add a <Code>_middleware.js</Code> file inside a{' '}
          <Code>big-promo</Code> folder with a <Code>index.js</Code> file for
          the page. Inside <Code>_middleware.js</Code> you can do something like
          this:
        </Text>
        <Snippet>{`import { NextResponse } from 'next/server'

export async function middleware(req) {
  // Clone the URL
  const url = req.nextUrl.clone()

  // Simulate connection with a redis cache
  const isInMaintenanceMode = Math.random() >= 0.5

  // If is in maintenance mode, point the url pathname to the maintenance page
  if (isInMaintenanceMode) {
    url.pathname = \`/maintenance\`

    // Rewrite to the url
    return NextResponse.rewrite(url)
  }
}`}</Snippet>
        <Text>
          If you need help with how to use a redis cache with edge functions you
          can see{' '}
          <Link href="https://edge-rewrites-upstash.vercel.app/">
            this example
          </Link>
          . If you want to see how this maintenance page works, check the{' '}
          <Link href="/big-promo">
            <Code>/big-promo</Code>
          </Link>{' '}
          route.
        </Text>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
