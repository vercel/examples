import { Page, Text, Link, Code, Snippet } from '@vercel/examples-ui'

export default function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">Redirects</Text>
        <ul>
          <li>
            <Link href="/simple-redirect-source">/simple-redirect-source</Link>{' '}
            - handled in API Route
          </li>
          <li>
            <Link href="/complex-redirect-source">
              /complex-redirect-source
            </Link>{' '}
            - handled in <Code>next.config.js</Code>
          </li>
        </ul>
      </section>
    </Page>
  )
}
