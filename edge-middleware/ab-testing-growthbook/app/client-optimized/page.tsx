import { configureServerSideGrowthBook } from '../../lib/growthbookServer'
import ClientApp from './ClientApp'
import { GrowthBook } from '@growthbook/growthbook'
import { Page } from '@vercel/examples-ui'

export default async function PrerenderedClientPage() {
  // Helper to configure cache for next.js
  configureServerSideGrowthBook()

  // Create and initialize a GrowthBook instance
  const gb = new GrowthBook({
    apiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST,
    clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
    decryptionKey: process.env.NEXT_PUBLIC_GROWTHBOOK_DECRYPTION_KEY,
  })
  await gb.init({ timeout: 1000 })

  // Get the payload to hydrate the client-side GrowthBook instance
  // We need the decrypted payload so the initial client-render can be synchronous
  const payload = gb.getDecryptedPayload()

  // Cleanup your GrowthBook instance
  gb.destroy()

  return (
    <Page className="flex flex-col gap-12">
      <ClientApp payload={payload} />
    </Page>
  )
}
