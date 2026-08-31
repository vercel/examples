import { Layout, Page, Text, Link, Button } from '@vercel/examples-ui'

export default function Index() {
  return (
    <Page>
      <Text variant="h1" className="mb-6">
        Homepage #1
      </Text>
      <Text className="mb-4">
        You had a 50% chance to see this homepage. If you refresh the page,
        you&apos;ll continue to see this version until your cookies are cleared.
      </Text>
      <Button
        type="button"
        className="mb-4"
        onClick={() => {
          document.cookie = 'visitor_id=; Max-Age=0; path=/;'
          window.location.reload()
        }}
      >
        Clear cookies and reload
      </Button>
      <Text>
        <Link href="/information">Learn more about this demo →</Link>
      </Text>
    </Page>
  )
}

Index.Layout = Layout
