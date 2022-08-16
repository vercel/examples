import { Text, Page, List, Link } from '@vercel/examples-ui'

export default function NewHomePage() {
  return (
    <>
      <Page>
        <Text variant="h1" className="mb-6">
          Homepage #2
        </Text>
        <Text className="mb-4">
          If you are shown this page, then you have been selected to see the new
          homepage in this A/B Experiment. Reload for a chance to see the main
          homepage and click below to get more information about this demo!
        </Text>
        <List>
          <li>
            <Link href="/information">More information</Link>
          </li>
        </List>
      </Page>
    </>
  )
}
