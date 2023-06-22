'use client'
// import { useEffect } from 'react'
import { Page, Text, Link, Code } from '@vercel/examples-ui'

export function MarketingB() {
  // useEffect(() => {
  //   track("New_About_Page", 'user', 'page_serve', null, {
  //     treatment: 'on',
  //   }).catch((error) => {
  //     console.error(
  //       'Request to Split blocked, probably because by an add blocker',
  //       error
  //     )
  //   })
  // }, [])

  return (
    <Page>
      <Text variant="h2" className="mb-6">
        Marketing Variant
      </Text>
      <Text className="text-lg mb-4">
        You&apos;re currently looking at the variant of the marketing page under{' '}
        <Code>app/marketing/b.tsx</Code>
      </Text>
      <Link href="/">Go back to /</Link>
    </Page>
  )
}
