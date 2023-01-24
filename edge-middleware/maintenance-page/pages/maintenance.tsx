import { Layout, Text, Page, Button } from '@vercel/examples-ui'
import { useRouter } from 'next/router'

function Home() {
  const { reload } = useRouter()

  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">Under Maintenance</Text>
        <Text>
          You can try to refresh the page to see if the issue is resolved.
        </Text>
        <Button onClick={reload}>Refresh</Button>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
