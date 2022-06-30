import { Layout, Page, Text, Link } from '@vercel/examples-ui'

export default function Product() {
  return (
    <Page>
      <Text variant="h2" className="mb-6">
        Product page
      </Text>
      <Text className="text-lg mb-4">This is the original product page</Text>
      <Text className="mb-4">
        You&apos;re currently on <b>/product</b>
      </Text>
      <Link href="/">Go back to /</Link>
    </Page>
  )
}

Product.Layout = Layout
