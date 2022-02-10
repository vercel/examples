import { Layout, Page, Text, Link, List } from '@vercel/examples-ui'
import Headers from '@components/headers'

export default function Omit() {
  return (
    <Page>
      <Text variant="h2" className="mb-6">
        Bot Protection with DataDome
      </Text>
      <Text className="text-lg mb-4">This page is not using DataDome.</Text>
      <Text className="mb-4">Navigate to other routes:</Text>
      <List className="mb-4">
        <li>
          <Link href="/">Home page using DataDome</Link>
        </li>
        <li>
          <Link href="/blocked">Behind captcha</Link>
        </li>
      </List>
      <hr className="border-t border-accents-2 mb-6" />
      <Text className="mb-4">Below is a fetch for this page</Text>
      <Headers path="/omit" />
    </Page>
  )
}

Omit.Layout = Layout
