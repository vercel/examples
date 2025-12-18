'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

export function Analytics() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: '/ph',
      ui_host: 'https://us.posthog.com',
      loaded: (posthog) => {
        posthog.identify()
        posthog.capture('page_viewed')
      },
    })
  }, [])

  return null
}

