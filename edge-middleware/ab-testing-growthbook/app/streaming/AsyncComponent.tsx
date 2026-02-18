import { configureServerSideGrowthBook } from '../../lib/growthbookServer'
import { cookies } from 'next/headers'
import { GB_UUID_COOKIE } from '../../middleware'
import { GrowthBook } from '@growthbook/growthbook'
import { GrowthBookTracking } from '../../lib/GrowthBookTracking'
import { Link, List, Text } from '@vercel/examples-ui'

export default async function AsyncComponent() {
  // Helper to configure cache for next.js
  configureServerSideGrowthBook()

  // Create and initialize a GrowthBook instance
  const gb = new GrowthBook({
    apiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST,
    clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
    decryptionKey: process.env.NEXT_PUBLIC_GROWTHBOOK_DECRYPTION_KEY,
  })
  await gb.init({ timeout: 1000 })

  // Artificial 2 second delay to simulate a slow server
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Set targeting attributes for the user
  gb.setAttributes({
    id: cookies().get(GB_UUID_COOKIE)?.value || '',
  })

  // Evaluate any feature flags
  const feature1Enabled = gb.isOn('feature1')
  const feature2Value = gb.getFeatureValue('feature2', 'fallback')

  // If the above features ran any experiments, get the tracking call data
  // This is passed into the <GrowthBookTracking> client component below
  const trackingData = gb.getDeferredTrackingCalls()

  // Cleanup your GrowthBook instance
  gb.destroy()

  return (
    <section className="flex flex-col gap-3">
      <Text>
        This component is streamed inside a server component (with an artificial
        2s delay).
      </Text>
      <Text>
        The code implemented here will automatically leverage{' '}
        <Link
          href="https://nextjs.org/docs/app/api-reference/next-config-js/partial-prerendering"
          target="_blank"
        >
          Partial Prerendering (PPR)
        </Link>{' '}
        in newer versions of Next.js that have it enabled.
      </Text>
      <List variant="ul">
        <li>
          feature1: <strong>{feature1Enabled ? 'ON' : 'OFF'}</strong>
        </li>
        <li>
          feature2: <strong>{feature2Value}</strong>
        </li>
      </List>

      <GrowthBookTracking data={trackingData} />
    </section>
  )
}
