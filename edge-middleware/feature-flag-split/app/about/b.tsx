'use client'
import { Page, Text, Code, Link } from '@vercel/examples-ui'

export function AboutB() {
  return (
    <Page>
      <Text variant="h2" className="mb-6">
        About Variant
      </Text>
      <Text className="text-lg mb-4">
        You&apos;re currently looking at the variant B of the about page under{' '}
        <Code>app/about/b.tsx</Code>
      </Text>
      <Link href="/">Go back to /</Link>
    </Page>
  )
}
