import { Layout, Page, Text, Code, Link } from '@vercel/examples-ui'

export default function Index() {
  return (
    <Page className="grid items-center justify-center">
      <div className="max-w-lg my-6 sm:my-20">
        <Text variant="h1" className="text-6xl mb-12">
          Edge Redirects
        </Text>
        <Text className="mb-4">
          This demo will redirect any path from <Link href="/1">/1</Link> -{' '}
          <Link href="/10000">/10000</Link> to <Code>/posts/1</Code> -{' '}
          <Code>/posts/10000</Code>
        </Text>
        <Text className="mb-4">
          The redirects are hardcoded on a JSON for the paths{' '}
          <Code>/1 - /1000</Code>, and coming from Redis (
          <Link href="https://upstash.com/">Upstash</Link>) for the next{' '}
          <Code>1001 - 10000</Code> paths
        </Text>
        <Text className="mb-4">
          Every route returns a latency (added as a query param) which should
          give you an idea of how the performance of reading a JSON differs from
          Redis
        </Text>
      </div>
    </Page>
  )
}

Index.Layout = Layout
