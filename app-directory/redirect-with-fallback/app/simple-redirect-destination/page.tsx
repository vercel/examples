import { Page, Text, Link, Code, Snippet } from '@vercel/examples-ui'
import { simpleRedirects } from '../../redirects'

export default function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">simple-redirect</Text>
        <Text>Config used for this redirect</Text>
        <Snippet>{JSON.stringify(simpleRedirects[0], null, 2)}</Snippet>
        <Text>
          <Link href="/">back</Link>
        </Text>
      </section>
    </Page>
  )
}
