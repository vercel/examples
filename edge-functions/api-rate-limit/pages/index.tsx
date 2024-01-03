import { Layout, Page, Text, Link } from '@vercel/examples-ui'
import Headers from '@components/headers'

export default function Index() {
  return (
    <Page>
      <Text variant="h2" className="mb-6">
        API Rate Limiting with Vercel KV
      </Text>
      <Text className="mb-4">
        By using Redis with Vercel KV, we can keep a counter of requests by IP
        address.
      </Text>
      <Text className="mb-4">
        For the demo below, you can send a maximum of{' '}
        <b>5 requests every 10 seconds</b>.
      </Text>
      <Headers path="/api/ping">Make a request</Headers>
      <Text>
        The pattern we&apos;re using in this example is inspired by the{' '}
        <Link
          href="https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting"
          target="_blank"
          rel="noreferrer"
        >
          GitHub API
        </Link>
        .
      </Text>
    </Page>
  )
}

Index.Layout = Layout
