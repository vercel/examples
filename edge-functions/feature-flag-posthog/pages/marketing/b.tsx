import { Layout, Page, Text, Code, Link } from '@vercel/examples-ui'

export default function Marketing() {
  return (
    <Page>
      <Text variant="h2" className="mb-6">
        Marketing Variant
      </Text>
      <Text className="text-lg mb-4">
        You&apos;re currently looking at the variant of the marketing page under{' '}
        <Code>pages/marketing/b.tsx</Code>
      </Text>
      <Link href="/">Go back to /</Link>
    </Page>
  )
}

Marketing.Layout = Layout
