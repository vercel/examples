import { Layout, Text, Page, Link } from '@vercel/examples-ui'
import { type PageType } from '../utils'

const Home: PageType = () => (
  <Page className="flex flex-col gap-12">
    <section className="flex flex-col gap-6">
      <Text variant="h1">Feature flags with Unleash</Text>
      <Text>
        Scaling Unleash Proxy on Vercel Edge Functions. Decreasing latency and
        traffic volume to Unleash instance by putting feature toggle definitions
        close to the user. Stickiness is achieved by setting a cookie.
      </Text>
    </section>

    <section className="flex flex-col gap-3">
      <Text variant="h2">A/B testing with Next.js Middleware</Text>
      <Text>
        Visit{' '}
        <Link href="/ab">
          <code>/ab</code> page
        </Link>
        . You will be redirected in the middleware to a variant based on a
        feature flag.
      </Text>
    </section>
  </Page>
)

Home.Layout = Layout

export default Home
