import { Layout, Page, Button, Text, Link, Code } from '@vercel/examples-ui'

function Index() {
  return (
    <Page>
      <div className="text-center mb-10">
        <Text variant="h1" className="mb-6">
          Streaming in Edge Functions
        </Text>
        <Text className="mb-4">
          With{' '}
          <Link href="https://vercel.com/docs/concepts/functions/edge-functions">
            Vercel Edge Functions
          </Link>{' '}
          we can do streaming at the edge using Web APIs. Click the buttons
          below for some examples:
        </Text>
        <nav className="space-x-6 mb-4">
          <Link href="/api/01-simple">
            <Button>Simple RS Stream</Button>
          </Link>
          <Link href="/api/02-simple-transform">
            <Button>Simple RS Stream + Transform</Button>
          </Link>
          <Link href="/api/03-external-transform">
            <Button>External Fetch + Transform</Button>
          </Link>
        </nav>

        <Text className="mb-4">
          The source code is available at <Code>pages/api/*.ts</Code>.
        </Text>
      </div>
    </Page>
  )
}

Index.Layout = Layout

export default Index
