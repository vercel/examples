import { cookies } from 'next/headers'
import { GB_UUID_COOKIE } from '../../middleware'
import ClientApp from './ClientApp'
import RevalidateMessage from '../revalidate/RevalidateMessage'
import { GrowthBook } from '@growthbook/growthbook'
import { configureServerSideGrowthBook } from '../../lib/growthbookServer'
import { GrowthBookTracking } from '../../lib/GrowthBookTracking'
import ClientComponent from './ClientComponent'
import { Page, List, Text } from '@vercel/examples-ui'

export default async function ServerCombo() {
  // Helper to configure cache for next.js
  configureServerSideGrowthBook()

  // Create and initialize a GrowthBook instance
  const gb = new GrowthBook({
    apiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST,
    clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
    decryptionKey: process.env.NEXT_PUBLIC_GROWTHBOOK_DECRYPTION_KEY,
  })
  await gb.init({ timeout: 1000 })

  // Set targeting attributes for the user
  gb.setAttributes({
    id: cookies().get(GB_UUID_COOKIE)?.value || '',
  })

  // Evaluate any feature flags
  const feature1Enabled = gb.isOn('feature1')
  const feature2Value = gb.getFeatureValue('feature2', 'fallback')

  // Get the payload to hydrate the client-side GrowthBook instance
  // We need the decrypted payload so the initial client-render can be synchronous
  const payload = gb.getDecryptedPayload()

  // If the above features ran any experiments, get the tracking call data
  // This is passed into the <GrowthBookTracking> client component below
  const trackingData = gb.getDeferredTrackingCalls()

  // Cleanup your GrowthBook instance
  gb.destroy()

  return (
    <Page className="flex flex-col gap-3">
      <Text variant="h2">Server / Client Hybrid</Text>
      <Text>
        This page fetches and uses feature flags server-side, then hydrates the
        client-side GrowthBook instance. This gives you maximum flexibility and
        performance.
      </Text>
      <Text>These features were rendered server-side:</Text>
      <List variant="ul">
        <li>
          feature1: <strong>{feature1Enabled ? 'ON' : 'OFF'}</strong>
        </li>
        <li>
          feature2: <strong>{feature2Value}</strong>
        </li>
      </List>

      <ClientApp payload={payload}>
        <ClientComponent />
      </ClientApp>

      <RevalidateMessage />

      <GrowthBookTracking data={trackingData} />
    </Page>
  )
}
