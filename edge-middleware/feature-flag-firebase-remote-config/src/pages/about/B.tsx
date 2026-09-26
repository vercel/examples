import { Code, Link, Page, Text } from '@vercel/examples-ui'

export default function VariantB() {
  return (
    <Page>
      <Text variant="h2" className="mb-6">
        About Variant B
      </Text>
      <Text className="text-lg mb-4">
        You&apos;re currently looking at the variant of the about page under{' '}
        <Code>pages/about/B.tsx</Code>
      </Text>
      <Link href="/">Go back to /</Link>
    </Page>
  )
}
