'use client'
import { onExperimentView } from '../../lib/GrowthBookTracking'
import ClientComponent from './ClientComponent'
import { GrowthBook, GrowthBookPayload } from '@growthbook/growthbook'
import { GrowthBookProvider } from '@growthbook/growthbook-react'
import { useMemo } from 'react'
import { GB_UUID_COOKIE } from '../../middleware'
import Cookies from 'js-cookie'

export default function ClientApp({ payload }: { payload: GrowthBookPayload }) {
  // Create a singleton GrowthBook instance for this page
  const gb = useMemo(
    () =>
      new GrowthBook({
        apiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST,
        clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
        decryptionKey: process.env.NEXT_PUBLIC_GROWTHBOOK_DECRYPTION_KEY,
        trackingCallback: onExperimentView,
        attributes: {
          id: Cookies.get(GB_UUID_COOKIE),
        },
      }).initSync({
        payload,
        // Optional, enable streaming updates
        streaming: true,
      }),
    [payload]
  )

  return (
    <GrowthBookProvider growthbook={gb}>
      <ClientComponent />
    </GrowthBookProvider>
  )
}
