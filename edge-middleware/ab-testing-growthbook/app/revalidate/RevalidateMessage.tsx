'use client'

import { Text } from '@vercel/examples-ui'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RevalidateMessage() {
  const [done, setDone] = useState(false)

  const router = useRouter()

  // Reset after 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDone(false)
    }, 3000)
    return () => clearTimeout(timeout)
  }, [done])

  return (
    <section className="border border-slate-400 dark:border-slate-600 rounded p-3 mt-8 bg-slate-200 dark:bg-slate-800">
      <Text>
        In this example app, feature flag definitions are cached for 60 seconds.
        For faster updates, you can configure an SDK Webhook in GrowthBook to
        hit the following route handler: <code>POST&nbsp;/revalidate</code>
      </Text>
      <div>
        {done ? (
          'Revalidation triggered!'
        ) : (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              fetch('/revalidate', { method: 'POST' })
              setDone(true)
              router.refresh()
            }}
          >
            Trigger revalidation manually
          </a>
        )}
      </div>
    </section>
  )
}
