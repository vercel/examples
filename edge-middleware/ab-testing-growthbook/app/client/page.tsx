'use client'
import Cookies from 'js-cookie'
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react'
import { useEffect, useMemo } from 'react'
import ClientComponent from './ClientComponent'
import { GB_UUID_COOKIE } from '../../middleware'
import { onExperimentView } from '../../lib/GrowthBookTracking'
import { Page } from '@vercel/examples-ui'

export default function ClientPage() {
  // Create a single memoized GrowthBook instance for the client
  const gb = useMemo(() => {
    return new GrowthBook({
      apiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST,
      clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
      decryptionKey: process.env.NEXT_PUBLIC_GROWTHBOOK_DECRYPTION_KEY,
      trackingCallback: onExperimentView,
    })
  }, [])

  useEffect(() => {
    // Fetch feature payload from GrowthBook
    gb.init({
      // Optional, enable streaming updates
      streaming: true,
    })

    // Set targeting attributes for the user
    let uuid = Cookies.get(GB_UUID_COOKIE)
    if (!uuid) {
      uuid = Math.random().toString(36).substring(2)
      Cookies.set(GB_UUID_COOKIE, uuid)
    }
    gb.setAttributes({
      id: uuid,
    })
  }, [gb])

  return (
    <GrowthBookProvider growthbook={gb}>
      <Page className="flex flex-col gap-12">
        <ClientComponent />
      </Page>
    </GrowthBookProvider>
  )
}
