import Image from 'next/image'
import {
  Layout,
  Text,
  Page,
  Button,
  Link,
  List,
  Code,
} from '@vercel/examples-ui'
import buildScreenShot from '../public/build.png'

function Home() {
  return (
    <Page>
      <section>
        <Text variant="h1" className="mb-6">
          Pagination with SSG
        </Text>
        <Text className="mb-4">
          This example shows how to implement page based pagination with{' '}
          <Link href="https://nextjs.org/docs/basic-features/data-fetching/get-static-props">
            SSG
          </Link>{' '}
          in Next.js.
        </Text>
        <Text className="mb-4">
          The first 5 paginated pages are cached in the edge at build time, and
          the rest are incrementally cached using{' '}
          <Link href="https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration">
            ISR
          </Link>
          , that way we can avoid increasing build times no matter how many
          pages we have while still keeping essential pages cached from the
          start.
        </Text>
        <Text className="mb-4">
          The example showcases a PLP (Product Listing Pages) where:
        </Text>
        <List className="mb-4">
          <li>There are 100 test products and 1 category (PLP)</li>
          <li>
            There are 10 results per page for a total of 10 pages, where 5 are
            pre-generated with <Code>getStaticPaths</Code>
          </li>
        </List>
        <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 transition-all text-sm mb-4">
          {`// pages/category/[page].tsx

export const getStaticPaths = async () => {
  return {
    // Prerender the next 5 pages after the first page, which is handled by the index page.
    // Other pages will be prerendered at runtime.
    paths: Array.from({ length: 5 }).map((_, i) => \`/category/\${i + 2}\`),
    // Block the request for non-generated pages and cache them in the background
    fallback: 'blocking',
  }
}`}
        </pre>
        <Image
          src={buildScreenShot}
          alt="build time for pagination strategy"
        ></Image>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        <Link href="/category">
          <Button>DEMO: Go to category page (PLP) </Button>
        </Link>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
