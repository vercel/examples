import Image from 'next/image'
import { Layout, Text, Page, Code, Link, Snippet } from '@vercel/examples-ui'

import board from '../public/board.jpg'

function Home() {
  return (
    <Page className="flex flex-col gap-12">
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
          You can add a <Code>middleware.js</Code> file in the root of your
          project. Inside <Code>middleware.js</Code> you can do something like
          this:
        </Text>
        <Snippet>{`import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: '/big-promo',
}

export async function middleware(req: NextRequest) {
  // Filter unwanted paths
  if (req.nextUrl.pathname !== '/big-promo') return NextResponse.next()

  // Simulate connection with a redis cache
  const isInMaintenanceMode = Math.random() >= 0.5

  // If is in maintenance mode, point the url pathname to the maintenance page
  if (isInMaintenanceMode) {
    req.nextUrl.pathname = \`/maintenance\`

    // Rewrite to the url
    return NextResponse.rewrite(req.nextUrl)
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
