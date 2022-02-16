import Head from 'next/head'
import Image from 'next/image'
import { Layout, Text, Page, Button, Link } from '@vercel/examples-ui'

import Snippet from '../components/Snippet'

import buildScreenShot from '../public/build.png'
function Home() {
  return (
    <Page>
      <Head>
        <title>SSG Pagination example</title>
        <meta
          name="description"
          content="Vercel example how to use Pagination with SSG"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">SSG Pagination Strategy usage example</Text>
        <Text>
          - How to implement pagination using SSG/ISR? <br />- How to reduce
          next.js build time for Listing Pages with pagination?
        </Text>
        <Text>
          The following example illustrates how pagination strategies can be
          used to handle large amounts of pages, such as store categories (PLP -
          Product Listing Pages).
        </Text>
        <Text variant="h2">Example situation:</Text>
        <Text>
          - 1000 categories (PLPs)
          <br />
          - each category has 1000 products
          <br />
          - there are 10 results per page
          <br />
          - therefore each category will have 100 pages
          <br />
        </Text>
        <Text variant="h2">Problem:</Text>
        <Text>
          Long build due to SEO requirement all pages are SSG (`getStaticPaths`){' '}
        </Text>
        <Text variant="h2">Solution:</Text>
        <Text>
          - On the build phase, only build the first few paginated pages and
          rest on the fly.
          <br />
          - This example shows how to create SSG Pagination for the first 5
          pages, and use ISR for the rest.
          <br />- For SEO reasons page 1 is redirected to index page to avoid
          duplicate content
        </Text>
        <Snippet>
          {`// pages/category/[page].tsx

export const getStaticPaths: GetStaticPaths = async () => {
  const prerenderPages = 5 // <--- number of pages to prerender

  ...

  return {
    ...
    fallback: 'blocking', // <--- this will build on the fly
  }
}`}
        </Snippet>
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
