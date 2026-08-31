import RevalidateMessage from '../revalidate/RevalidateMessage'
import { configureServerSideGrowthBook } from '../../lib/growthbookServer'
import { GrowthBook } from '@growthbook/growthbook'
import { Text, List, Page } from '@vercel/examples-ui'

export default async function ServerStatic() {
  // Helper to configure cache for next.js
  configureServerSideGrowthBook()

  // Create and initialize a GrowthBook instance
  const gb = new GrowthBook({
    apiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST,
    clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
    decryptionKey: process.env.NEXT_PUBLIC_GROWTHBOOK_DECRYPTION_KEY,
  })
  await gb.init({ timeout: 1000 })

  // By not using cookies or headers, this page can be statically rendered
  // Note: This means you can't target individual users or run experiments

  // Evaluate any feature flags
  const feature1Enabled = gb.isOn('feature1')
  const feature2Value = gb.getFeatureValue('feature2', 'fallback')

  // Cleanup your GrowthBook instance
  gb.destroy()

  return (
    <Page className="flex flex-col gap-3">
      <Text variant="h2">Static Pages</Text>
      <Text>
        This page is fully statically rendered at build time. As a consequence,
        targeting rules and experiments will not work since they depend on
        user-specific attributes.
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
    </Page>
  )
}
