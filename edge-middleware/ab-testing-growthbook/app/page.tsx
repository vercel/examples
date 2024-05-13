import { Page, Text, Code, Link, List } from '@vercel/examples-ui'

export default function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <Text variant="h1">GrowthBook Next.js Example</Text>
      <section className="flex flex-col gap-6">
        <Text variant="h2">Configuration</Text>
        <List variant="ol">
          <li className="list-decimal">
            <Text>
              First, create a free{' '}
              <Link href="https://www.growthbook.io" target="_blank">
                GrowthBook Account
              </Link>{' '}
              and add a new SDK Connection, selecting JavaScript (or React) as
              the language.
            </Text>
          </li>
          <li className="list-decimal">
            <Text>
              Next, in this example root, copy <Code>.env.local.example</Code>{' '}
              to <Code>.env.local</Code> and fill in the values from your
              GrowthBook SDK Connection.
            </Text>
          </li>
          <li className="list-decimal">
            <p>
              Finally, create these two feature flags in your GrowthBook
              account. These will be referenced in the examples below.
            </p>
            <List variant="ul">
              <li>
                Key: <Code>feature1</Code>, Type:{' '}
                <Code>Boolean (true/false)</Code>
              </li>
              <li>
                Key: <Code>feature2</Code>, Type: <Code>String</Code>
              </li>
            </List>
          </li>
        </List>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Examples</Text>
        <List variant="ul">
          <li>
            <Link href="/server">Dynamic Server Rendering</Link> - Use flags
            within Server Components
          </li>
          <li>
            <Link href="/client-optimized">Optimized Client Rendering</Link> -
            Use flicker-free flags within Client Components
          </li>
          <li>
            <Link href="/hybrid">Server/Client Hybrid</Link> - Combine the above
            two approaches in a single page
          </li>
          <li>
            <Link href="/static">Static Pages</Link> - Use feature flags only
            during build time
          </li>
          <li>
            <Link href="/streaming">Streaming Server Components</Link> -
            Supports experimental Partial Prerendering
          </li>
          <li>
            <Link href="/client">Client Rendering (Unoptimized)</Link> - Fetch
            and use flags client-side (flicker warning)
          </li>
        </List>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">How it Works</Text>
        <Text>
          There is a <code>middleware.ts</code> file that ensures a UUID cookie
          is available before the first request is processed. This UUID is
          shared between the client and server and is used to assign consistent
          feature values to visitors when a percentage rollout or experiment is
          running.
        </Text>
        <Text>
          Feature and experiment definitions are fetched from the server in all
          examples (except in the Unoptimized Client example). This ensures that
          the values are known at the initial render time, which lets us avoid
          the flicker commonly associated with client-side feature flags and
          experiments.
        </Text>
        <Text>
          Server-fetched feature flags and experiment definitions are persisted
          in the Next.js data cache for 60 seconds (configurable in{' '}
          <code>src/lib/growthbookServer.ts</code>). For faster updates, there
          is a <code>POST /revalidate</code> route handler that can be triggered
          from an SDK Webhook in GrowthBook.
        </Text>
        <Text>
          If an experiment is run server-side, data about which variation the
          user saw is sent to the client where an analytics event is triggered
          (or console.log in these examples). This happens via the{' '}
          <code>GrowthBookTracking</code> client component defined in{' '}
          <code>src/lib/GrowthBookTracking</code>.
        </Text>
      </section>
    </Page>
  )
}
