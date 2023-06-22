'use client'
// import { useEffect } from 'react'
import { Page, Text, Link, Code } from '@vercel/examples-ui'

export function MarketingA() {
  // useEffect(() => {
  //   track('New_Marketing_Page', 'user', 'page_serve', null, {
  //     treatment: 'off',
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
        Marketing page
      </Text>
      <Text className="text-lg mb-4">This is the original marketing page</Text>
      <Text className="mb-4">
        You&apos;re currently on <b>/marketing</b>
      </Text>
      <Link href="/">Go back to /</Link>
    </Page>
  )
}
