import { Layout, Page, Text, Link, List } from '@vercel/examples-ui'
import Headers from '@components/headers'

export default function Index() {
  return (
    <Page>
      <Text variant="h2" className="mb-6">
        Bot Protection with DataDome
      </Text>
      <Text className="text-lg mb-4">
        This page has DataDome enabled, and you&apos;re not a bad bot.
      </Text>
      <Text className="mb-4">Navigate to other routes:</Text>
      <List className="mb-4">
        <li>
          <Link href="/omit">Without DataDome</Link>
        </li>
        <li>
          <Link href="/blocked">Behind captcha</Link>
        </li>
      </List>
      <hr className="border-t border-accents-2 mb-6" />
      <Text className="mb-4">
        Below is a fetch for this page and to a page without DataDome enabled
      </Text>
      <Headers path="/" />
      <Headers path="/omit" />
      <Text className="mb-4">
        By checking the request to this page in the network tab in devtools,
        you&apos;ll be able to see how is latency affected by DataDome after
        looking at the headers.
      </Text>
    </Page>
  )
}

Index.Layout = Layout
