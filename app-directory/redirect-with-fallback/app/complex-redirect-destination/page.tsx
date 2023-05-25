import { Page, Text, Link, Code, Snippet } from '@vercel/examples-ui'

export default function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">complex-redirect</Text>
        <Text>
          <Link href="/">back</Link>
        </Text>
      </section>
    </Page>
  )
}
