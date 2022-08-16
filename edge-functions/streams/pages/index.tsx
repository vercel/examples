import { Layout, Page, Button, Text } from '@vercel/examples-ui'
import Link from 'next/link'

function Index() {
  return (
    <Page>
      <div className="text-center mb-6">
        <Text variant="h2" className="mb-4">
          Streaming from the Edge with Vercel Edge Functions
        </Text>
        <Text className="mb-4">
          <i className="font-semibold">Vercel Edge Functions</i> allow you to
          deliver content to your site&apos;s visitors with speed. <br /> They
          are deployed globally by default on Vercel&apos;s Edge Network and
          enable you to move server-side logic to the Edge, close to your
          visitor&apos;s origin.
        </Text>
        <div className="mt-20">
          <div className="my-4">
            Examples using <strong>Edge Runtime and Streams</strong>:
            <br />{' '}
            <span className="text-sm">
              Find the code in{' '}
              <pre className="inline bg-gray-100 px-1.5 rounded-sm">
                pages/api
              </pre>
            </span>
          </div>
          <nav className="space-x-6">
            <Link href="/api/01-simple">
              <a>
                <Button>Simple RS Stream</Button>
              </a>
            </Link>
            <Link href="/api/02-simple-transform">
              <a>
                <Button>Simple RS Stream + Transform</Button>
              </a>
            </Link>
            <Link href="/api/03-external-transform">
              <a>
                <Button>External Fetch + Transform</Button>
              </a>
            </Link>
          </nav>
        </div>
      </div>
    </Page>
  )
}

Index.Layout = Layout

export default Index
