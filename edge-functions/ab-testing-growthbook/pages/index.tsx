import { Layout, Page, Text, Link, List } from '@vercel/examples-ui'

export default function Index() {
  return (
    <Page>
      <Text variant="h1" className="mb-6">
        Homepage #1
      </Text>
      <Text className="mb-4">
        If you are shown this page, then you have been selected to see the main
        homepage in this A/B Experiment. Reload for a chance to see the new
        homepage and click below to get more information about this demo!
      </Text>
      <List>
        <li>
          <Link href="/information">More information</Link>
        </li>
      </List>
    </Page>
  )
}

Index.Layout = Layout
