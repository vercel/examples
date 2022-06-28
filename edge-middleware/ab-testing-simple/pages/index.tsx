import { Layout, Page, Text, Link, List } from '@vercel/examples-ui'

export default function Index() {
  return (
    <Page>
      <Text variant="h1" className="mb-6">
        AB testing with buckets
      </Text>
      <Text className="mb-4">
        In this demo we use cookies to assign a bucket with the variant to show.
        Visit one of the pages below and a bucket will be assigned to you.
      </Text>
      <List>
        <li>
          <Link href="/home">/home</Link>
        </li>
        <li>
          <Link href="/marketing">/marketing</Link>
        </li>
      </List>
    </Page>
  )
}

Index.Layout = Layout
