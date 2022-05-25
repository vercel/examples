import { Layout, Page, Text, Code, Link } from '@vercel/examples-ui'
import Navbar from '@acme/pages/components/navbar'

export default function Index() {
  return (
    <Page>
      <Navbar isDocsApp />
      <Text variant="h1" className="mb-6">
        Docs
      </Text>
      <Text className="mb-4">
        This is the index page in the docs app (
        <Code>apps/docs/pages/index.tsx</Code>).
      </Text>
      <Text>
        Navigations between <Link href="/docs">Docs</Link> and{' '}
        <Link href="/docs/about">About Docs</Link> are client-side transitions
        because they&apos;re part of the same Next.js app. Navigating to{' '}
        <Link href="/docs">Home (Multi Zones)</Link> requires a page refresh
        because it lives in a different Next.js app.
      </Text>
    </Page>
  )
}

Index.Layout = Layout
