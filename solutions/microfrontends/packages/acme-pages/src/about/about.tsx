import { Layout, Page, Text, Code, Link } from '@vercel/examples-ui'
import Navbar from '../components/navbar'

export default function About(): React.ReactNode {
  return (
    <Page>
      <Navbar />
      <Text variant="h1" className="mb-6">
        About
      </Text>
      <Text>
        This is the about page, defined in{' '}
        <Code>packages/acme-pages/src/about</Code> and imported by{' '}
        <Code>apps/main/pages/about.tsx</Code>
      </Text>
      <Text className="mt-4">
        Navigations between <Link href="/">Home</Link> and{' '}
        <Link href="/about">About</Link> are client-side transitions because
        they&apos;re part of the same Next.js app, even if their source lives
        externally. Navigating to{' '}
        <a
          className="text-link hover:text-link-light transition-colors"
          href="/docs"
        >
          Docs (Multi Zones)
        </a>{' '}
        requires a page refresh because it lives in a different Next.js app.
      </Text>
    </Page>
  )
}

About.Layout = Layout
