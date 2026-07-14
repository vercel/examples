import { Page, Text, Code, Link, List } from '@vercel/examples-ui'

export default function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">🖤 SanityPress</Text>
        <Text>
          A fully customizable Next.js and Sanity starter template with Tailwind
          CSS and pre-built schema for rapid website development.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">🚀 Get started in minutes</Text>
        <List>
          <li>
            <Link href="https://sanitypress.dev/">Live Demo</Link>
          </li>
          <li>
            <Link href="https://sanitypress.dev/docs">SanityPress Docs</Link>
          </li>
          <li>
            <Link href="https://github.com/nuotsu/sanitypress">
              GitHub Repo
            </Link>{' '}
            (<code>nuotsu/sanitypress</code>)
          </li>
        </List>
      </section>
    </Page>
  )
}
