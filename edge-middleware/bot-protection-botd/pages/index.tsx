import { Layout, Page, Text, Code, Link, List } from '@vercel/examples-ui'
import Headers from '@components/headers'
import BotdResult from '@components/botd-result'

export default function Index() {
  return (
    <Page>
      <Text variant="h2" className="mb-6">
        Bot Protection with Botd (by FingerprintJS)
      </Text>
      <Text className="mb-4">
        This page has Botd enabled. The edge does light bot detection by making
        a request to the <Code>/edge</Code> endpoint from Botd.
      </Text>
      <Text className="mb-4">Navigate to other routes:</Text>
      <List className="mb-4">
        <li>
          <Link href="/omit">Without Botd</Link>
        </li>
        <li>
          <Link href="/blocked">Page with Bot Detected</Link>
        </li>
      </List>
      <hr className="border-t border-accents-2 mb-6" />
      <Text className="mb-4">
        Below is a fetch for this page and to a page without Botd enabled:
      </Text>
      <Headers path="/" />
      <Headers path="/omit" />
      <Text className="mb-4">
        By checking the request to this page in the network tab in devtools,
        you&apos;ll be able to see how is latency affected by Botd after looking
        at the headers.
      </Text>
      <Text className="mb-4">
        After the page loads, we load the botd script and then we can start
        doing full bot protection by calling the <Code>/detect</Code> endpoint.
        You can see the result from Botd below:
      </Text>
      <BotdResult />
    </Page>
  )
}

Index.Layout = Layout
