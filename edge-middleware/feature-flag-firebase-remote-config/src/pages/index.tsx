import { Layout, Text, Page, Code, Link } from '@vercel/examples-ui'

export default function Index() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">A/B Testing with Firebase remote config</Text>
        <Text className="mb-4">
          The about pages will render a different version among Variant A, B and
          C with an equal chance:
        </Text>
        <Text>
          Navigate to&nbsp;
          <Link href="/about">
            <Code>/about</Code>
          </Link>
          &nbsp;to try out feature flag with Firebase remote config
        </Text>
      </section>
    </Page>
  )
}

Index.Layout = Layout
