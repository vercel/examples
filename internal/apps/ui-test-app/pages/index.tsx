import { type ReactNode } from 'react'
import { Layout, Text, Page, Link, Code } from '@vercel/examples-ui'

const Snippet = ({ children }: { children: ReactNode }) => (
  <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 transition-all">
    {children}
  </pre>
)

function Home() {
  return (
    <Page className="space-y-4">
      <Text variant="h1">UI Test App</Text>
      <Text>
        This is some text to test the <Code>@vercel/examples-ui</Code> package.
      </Text>
      <Text>
        This is a link with:{' '}
        <Link href="https://nextjs.org/docs/api-reference/next/image">
          click me
        </Link>
        . And a link with code:{' '}
        <Link href="https://nextjs.org/docs/api-reference/next/image">
          <Code>click me</Code>
        </Link>
        .
      </Text>
    </Page>
  )
}

Home.Layout = Layout

export default Home
