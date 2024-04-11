import { Text, Page, Link } from '@vercel/examples-ui'
import { type LDClient, init } from '@launchdarkly/vercel-server-sdk'
import { createClient } from '@vercel/edge-config'
import { cache } from 'react'

export const metadata = {
  title: 'Vercel x LaunchDarkly example',
  description:
    'An example showing how to use LaunchDarkly and Vercel. This example builds on top of the LaunchDarkly integration which syncs LaunchDarkly flags into Edge Config, so you can read them from your application near-instantly.',
}
export const runtime = 'edge'

const edgeConfigClient = createClient(process.env.EDGE_CONFIG)

// In Edge Runtime it's not possible to share promises across requests.
//
// waitForInitialization attempts to use a pending promise if one exists, so
// we need to create a new client for every request to prevent reading a promise
// created by an earlier request.
//
// However, we still want to allow reusing the LaunchDarkly client for the
// duration of a specific request. This allows multiple components
// to call getLdClient() and to get the same instance. We use cache() to
// keep the LaunchDarkly client around for the duration of a request.
//
// cache resets for each server request, so a subsequent request will receive
// a new instance of the LaunchDarkly client.
//
// Notes
// - This setup is only necessary for Edge Functions, not for Serverless Functions
// - When using the LaunchDarkly client in Edge Middleware make sure to use
//   a fresh instance for every request, as it has the same promise sharing
//   problem as Edge Functions otherwise.
// - "cache" does not work in Edge Middleware, so you'd need to create a fresh
//   instance of the LaunchDarkly client for every request.
const getLdClient = cache(async (): Promise<LDClient> => {
  const ldClient = init(
    process.env.NEXT_PUBLIC_LD_CLIENT_SIDE_ID!,
    edgeConfigClient
  )
  await ldClient.waitForInitialization()
  return ldClient
})

export default async function Home() {
  const before = Date.now()

  const ldClient = await getLdClient()

  const ldContext = {
    kind: 'org',
    key: 'my-org-key',
    someAttribute: 'my-attribute-value',
  }
  const flagValue = await ldClient.variation('my-flag', ldContext, true)
  const duration = Date.now() - before

  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">feature-flag-launchdarkly usage example</Text>
        <Text>
          This example shows how to use the{' '}
          <Link
            href="https://vercel.com/integrations/launchdarkly"
            target="_blank"
          >
            LaunchDarkly integration
          </Link>{' '}
          with Edge Config.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Feature Flag</Text>
        <p>
          Flag is <span className="font-bold">{flagValue ? 'on' : 'off'}</span>.{' '}
          Loading flag took&nbsp;
          <code>{duration === 0 ? `<1` : duration}ms</code>.
        </p>
        <Text>
          The feature flag above is loaded from Edge Config. The LaunchDarkly
          integration syncs all LaunchDarkly flags into Edge Config so they can
          be read from your application near-instantly.
        </Text>
        <Text>
          Read more about this in our{' '}
          <Link
            href="https://vercel.com/blog/edge-config-and-launch-darkly"
            target="_blank"
          >
            announcement
          </Link>
          .
        </Text>
      </section>
    </Page>
  )
}
