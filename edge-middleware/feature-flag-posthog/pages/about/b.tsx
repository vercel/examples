import { Layout, Page, Text, Code, Link } from '@vercel/examples-ui'

export default function About() {
  return (
    <Page>
      <Text variant="h2" className="mb-6">
        About Variant
      </Text>
      <Text className="text-lg mb-4">
        You&apos;re currently looking at the variant of the about page under{' '}
        <Code>pages/about/b.tsx</Code>
      </Text>
      <Link href="/">Go back to /</Link>
    </Page>
  )
}

About.Layout = Layout
