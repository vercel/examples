import { Layout, Page, Text, Link, List } from '@vercel/examples-ui'

export default function Index() {
  return (
    <Page>
      <Text variant="h1" className="mb-6">
        AB testing with GrowthBook
      </Text>
      <Text className="mb-4">
        In this demo, you will be randomly shown either one type of homepage or
        another. This is similar to an A/B Test, where about 50% of users will
        be randomly selected to see one type of homepage and the rest another,
        using GrowthBook.
      </Text>
      <List>
        <li>
          <Link href="/new_homepage">
            Click here to see the other homepage or reload
          </Link>
        </li>
        <li>
          <Link href="/marketing">/marketing</Link>
        </li>
      </List>
    </Page>
  )
}

Index.Layout = Layout
