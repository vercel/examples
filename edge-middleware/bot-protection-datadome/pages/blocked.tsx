import { Layout, Page, Text, Code, Link, List } from '@vercel/examples-ui'
import Headers from '@components/headers'

export default function Blocked() {
  return (
    <Page>
      <Text variant="h2" className="mb-6">
        Bot Protection with DataDome
      </Text>
      <Text className="text-lg mb-4">
        This page should ask you for captcha once, future refreshes or
        navigations to this page won&apos;t ask you again, unless the{' '}
        <Code>datadome</Code> cookie is removed
      </Text>
      <Text className="mb-4">
        To remove the cookie, open devtools, navigate to Application - Storage -
        Cookies, and remove the <Code>datadome</Code> cookie
      </Text>
      <Text className="mb-4">Navigate to other routes:</Text>
      <List className="mb-4">
        <li>
          <Link href="/">Home page using DataDome</Link>
        </li>
        <li>
          <Link href="/omit">Without DataDome</Link>
        </li>
      </List>
      <hr className="border-t border-accents-2 mb-6" />
      <Text className="mb-4">Below is a fetch for this page</Text>
      <Headers path="/blocked" />
    </Page>
  )
}

Blocked.Layout = Layout
