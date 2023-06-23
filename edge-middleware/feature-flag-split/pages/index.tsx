import { Layout, Page, Text, List, Link, Button } from '@vercel/examples-ui'

export default function Index() {
  return (
    <Page>
      <Text variant="h2" className="mb-6">
        AB testing with Split
      </Text>
      <Text className="mb-4">
        The about and marketing pages will each render a different version with
        a 50% chance:
      </Text>
      <List className="mb-4">
        <li>
          <Link href="/about">/about</Link>
        </li>
        <li>
          <Link href="/marketing">/marketing</Link>
        </li>
      </List>
      <Text className="text-lg mb-4">
        Click the buttons below if you want to change the current variant (each
        variant has a 50% chance)
      </Text>
    </Page>
  )
}

Index.Layout = Layout
