import { cookies } from 'next/headers'
import { GB_UUID_COOKIE } from '../../middleware'
import RevalidateMessage from '../revalidate/RevalidateMessage'
import { GrowthBook } from '@growthbook/growthbook'
import { GrowthBookTracking } from '../../lib/GrowthBookTracking'
import { configureServerSideGrowthBook } from '../../lib/growthbookServer'
import { List, Page, Text } from '@vercel/examples-ui'

export default async function ServerDynamic() {
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
  await gb.setAttributes({
    id: cookies().get(GB_UUID_COOKIE)?.value || '',
  })

  // Evaluate any feature flags
  const feature1Enabled = gb.isOn('feature1')
  const feature2Value = gb.getFeatureValue('feature2', 'fallback')

  // If the above features ran any experiments, get the tracking call data
  // This is passed into the <GrowthBookTracking> client component below
  const trackingData = gb.getDeferredTrackingCalls()

  // Cleanup
  gb.destroy()

  return (
    <Page className="flex flex-col gap-3">
      <Text variant="h2">Dynamic Server Rendering</Text>
      <Text>
        This page renders dynamically for every request. You can use feature
        flag targeting and run A/B experiments entirely server-side.
      </Text>
      <List variant="ul">
        <li>
          feature1: <strong>{feature1Enabled ? 'ON' : 'OFF'}</strong>
        </li>
        <li>
          feature2: <strong>{feature2Value}</strong>
        </li>
      </List>

      <RevalidateMessage />

      <GrowthBookTracking data={trackingData} />
    </Page>
  )
}
