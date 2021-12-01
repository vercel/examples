import { Layout, Page, Text, List, Code } from '@vercel/edge-functions-ui'

export default function Index() {
  return (
    <Page>
      <Text variant="h1" className="mb-6">
        Shared Dependencies
      </Text>
      <Text className="mb-4">
        In this demo we have two dependencies that are installed in the app and
        available in the same repository.
      </Text>
      <List>
        <li>
          <Code>packages/ui</Code> exports the button you see below
        </li>
        <li>
          <Code>packages/utils</Code> exports functions to generate random
          colors.
        </li>
      </List>
    </Page>
  )
}

Index.Layout = Layout
