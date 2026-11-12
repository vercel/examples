import { Link, Page, Text } from '@vercel/examples-ui'

export default function VariantA() {
  return (
    <Page>
      <Text variant="h2" className="mb-6">
        About page
      </Text>
      <Text className="text-lg mb-4">This is the original about page</Text>
      <Text className="mb-4">
        You&apos;re currently on <b>/about</b>
      </Text>
      <Link href="/">Go back to /</Link>
    </Page>
  )
}
