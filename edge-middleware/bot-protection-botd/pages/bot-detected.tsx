import { Layout, Page, Text, Code, Link, List } from '@vercel/examples-ui'
import Headers from '@components/headers'
import BotdResult from '@components/botd-result'

export default function BotDetected() {
  return (
    <Page>
      <Text variant="h2" className="mb-6">
        Bot Protection with Botd (by FingerprintJS)
      </Text>
      <Text className="mb-4">
        After doing light bot detection, we have detected that you are a bot!
      </Text>
      <Text className="mb-4">Navigate to other routes:</Text>
      <List className="mb-4">
        <li>
          <Link href="/">Home page using Botd</Link>
        </li>
        <li>
          <Link href="/omit">Without Botd</Link>
        </li>
      </List>
      <hr className="border-t border-accents-2 mb-6" />
      <Text className="mb-4">Below is a fetch for this page:</Text>
      <Headers path="/blocked" />
      <Text className="mb-4">
        Below is the result of doing full bot protection by calling the{' '}
        <Code>/detect</Code> endpoint from Botd after changing the{' '}
        <Code>userAgent</Code> to a headless browser:
      </Text>
      <BotdResult isBot />
    </Page>
  )
}

BotDetected.Layout = Layout
