import { Layout, Page, Text, Code } from '@vercel/examples-ui'

export default function Index() {
  return (
    <Page>
      <Text variant="h2" className="mb-6">
        Query params filter
      </Text>
      <Text>
        Any query param that&apos;s not <Code>allowed</Code> will be removed
        from the URL.
      </Text>
    </Page>
  )
}

Index.Layout = Layout
