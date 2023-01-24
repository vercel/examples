import { Layout, Page, Text } from '@vercel/examples-ui'

const Index = () => (
  <Page>
    <div className="text-center mb-6">
      <Text variant="h1" className="mb-4">
        IP Blocking with Upstash
      </Text>
      <Text>
        You are not blocked. Otherwise you won&apos;t be able to see this page
        but the <b>/blocked</b> page instead.
      </Text>
    </div>
  </Page>
)

Index.Layout = Layout

export default Index
