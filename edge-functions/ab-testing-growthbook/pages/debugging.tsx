import { Text, Page, Link, Layout, Code, List } from '@vercel/examples-ui'

export default function Debugging() {
  return (
    <Page>
      <Text variant="h1" className="mb-6">
        Error: No Experiment Running
      </Text>
      <Text className="mb-4">
        You are seeing this page because the feature flag is not configured
        correctly in GrowthBook for this demo. This is likely happening because
        of one of the following reasons:
      </Text>
      <List className="mb-4">
        <li>
          Incorrect <Code>FEATURES_ENDPOINT</Code> environment variable
        </li>
        <li>
          A feature with the key <Code>new-homepage</Code> does not exist in
          GrowthBook
        </li>
        <li>The feature is toggled OFF in GrowthBook for your environment</li>
        <li>
          There is no &quot;A/B Experiment&quot; rule added to the feature
        </li>
        <li>
          You added targeting conditions to the Experiment rule that are not
          being met
        </li>
      </List>
      <Text className="mb-4">
        Look in your Next.js terminal logs for more information.
      </Text>
      <Text>
        <Link href="/information">Learn more about this demo →</Link>
      </Text>
    </Page>
  )
}

Debugging.Layout = Layout
