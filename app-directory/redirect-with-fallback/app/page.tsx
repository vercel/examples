import { Page, Text, Link, Code } from '@vercel/examples-ui'

export default function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">Redirects</Text>
        <ul>
          <li>
            <Link href="/simple-redirect-source">/simple-redirect-source</Link>{' '}
            - handled in a{' '}
            <Link href="https://nextjs.org/docs/app/building-your-application/routing/router-handlers">
              Route Handler
            </Link>
          </li>
          <li>
            <Link href="/complex-redirect-source">
              /complex-redirect-source
            </Link>{' '}
            - handled by{' '}
            <Link href="https://nextjs.org/docs/app/api-reference/next-config-js/redirects">
              redirects
            </Link>{' '}
            in <Code>next.config.js</Code>
          </li>
        </ul>
      </section>
    </Page>
  )
}
