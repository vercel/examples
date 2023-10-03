import { Layout, Page, Text, Code, Link } from '@vercel/examples-ui'
import Navbar from '@acme/pages/components/navbar'

export default function About() {
  return (
    <Page>
      <Navbar isDocsApp />
      <Text variant="h1" className="mb-6">
        About Docs
      </Text>
      <Text className="mb-4">
        This is the about page in the docs app (
        <Code>apps/docs/pages/about.tsx</Code>).
      </Text>
      <Text>
        Navigations between <Link href="/">Docs</Link> and{' '}
        <Link href="/about">About Docs</Link> are client-side transitions
        because they&apos;re part of the same Next.js app. Navigating to{' '}
        <a
          className="text-link hover:text-link-light transition-colors"
          href="/"
        >
          Home (Multi Zones)
        </a>{' '}
        requires a page refresh because it lives in a different Next.js app.
      </Text>
    </Page>
  )
}

About.Layout = Layout
