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
        using GrowthBook (an open source feature-flagging and experimentation
        platform).
      </Text>
      <List>
        <li>
          <Link href="https://github.com/growthbook/growthbook">
            GrowthBook GitHub
          </Link>
        </li>
        <li>
          <Link href="https://www.growthbook.io/">GrowthBook Website</Link>
        </li>
      </List>
    </Page>
  )
}

Index.Layout = Layout
