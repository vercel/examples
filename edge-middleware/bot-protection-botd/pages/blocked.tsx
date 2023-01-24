import { Layout, Page, Text } from '@vercel/examples-ui'

export default function Blocked() {
  return (
    <Page>
      <Text variant="h2" className="mb-6">
        Bot Protection with Botd (by FingerprintJS)
      </Text>
      <Text>
        You should never see this page! Why? Because we intentionally change the
        user agent to match a bot, and then the edge will rewrite your request
        to /bot-detected
      </Text>
    </Page>
  )
}

Blocked.Layout = Layout
