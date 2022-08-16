import {
  Layout,
  Page,
  Button,
  Input,
  Text,
  Link,
  Code,
} from '@vercel/examples-ui'

function Index() {
  return (
    <Page>
      <div className="text-center mb-6">
        <Text variant="h1" className="mb-4">
          Streaming from the Edge with Vercel Edge Functions
        </Text>
        <Text className="mb-4">
          With <i className="font-semibold">Vercel&apos;s Edge Middleware</i>{' '}
          we&apos;re able to execute functions at the edge level and act on
          mid-flight requests instantly. This example uses Upstash for API rate
          limiting and to add rules that allows us to block certain IPs.
        </Text>
      </div>
    </Page>
  )
}

Index.Layout = Layout

export default Index
