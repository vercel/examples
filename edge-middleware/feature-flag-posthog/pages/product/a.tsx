import { Layout, Page, Text, Code, Link } from '@vercel/examples-ui'

export default function Product() {
  return (
    <Page>
      <Text variant="h2" className="mb-6">
        Product Variant
      </Text>
      <Text className="text-lg mb-4">
        You&apos;re currently looking at the variant of the product page under{' '}
        <Code>pages/product/a.tsx</Code>
      </Text>
      <Link href="/">Go back to /</Link>
    </Page>
  )
}

Product.Layout = Layout
