import type { GetStaticProps } from 'next'
import type { Product } from '../types'
import type { FC } from 'react'

import Head from 'next/head'
import Image from 'next/image'
import { Layout, Text, Page, Code, Link } from '@vercel/examples-ui'
import api from '../api'
import ProductCard from '../components/ProductCard'

import notOptimizing from "../public/no-optimizing-board.jpg"
import optimizing from "../public/optimizing-board.jpg"

interface Props {
  products: Product[];
}

const Snippet: FC = ({children}) => {
  return (
    <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 transition-all">
      {children}
    </pre>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();

  return {
    props: {
      products
    }
  }
}

function Home({products}: Props) {
  return (
    <Page>
      <Head>
        <title>Rewrite at the edge using Upstash</title>
        <meta name="description" content="How to avoid calling several services by pre-checking stock at the edge using a redis cache" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">Rewriting at the edge using Upstash</Text>
        <Text>It's a common case to have a details page of a product or item and request our database every time a user requests the page.</Text>
        <Text>Sometimes we don't have stock but we still hit our services, which may take a good amount of time depending on where the source is and it can be expensive depending on how many requests for that page we have.</Text>
        <Text>We can take some strategies to get faster responses using the edge, checking with a Redis cache if we have stock for our product and rewriting to a previously generated static no stock page of our product. That way we not only reduce the TTFB due to low latency responses and serving static content, but also reduces the amount of connections to our database and we avoid redirects (improving SEO) and improves UX (avoiding spinners / skeletons while we check if we have stock or not)</Text>
        <Text>Lets imagine the flow of an e-commerce site that use <Code>getServerSideProps</Code> to get the latest data for a product details page:</Text>
        <Image src={notOptimizing} />
        <Text>Now, lets check at the edge if we have stock with a Redis cache and rewrite in case we don't have stock:</Text>
        <Image src={optimizing} />
        <Text>Thats it, we only have to toggle the flag when we add an item or run out of stock.</Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        <Text variant="h2">
          Implementing the solution
        </Text>
        <Text>For this example we will have 3 files related to the product details page. <Code>/pages/product/[id]/no-stock.js</Code>, <Code>/pages/product/[id]/index.js</Code> and <Code>/pages/product/[id]/_middleware.js</Code>.</Text>
        <Text>Lets start with our <Code>/pages/product/[id]/index.js</Code> <Code>getServerSideProps</Code> function:</Text>
        <Snippet>{`export const getServerSideProps = async ({params}) => {
  const product = await api.fetch(params.id)

  if (!product) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      product
    }
  }
}`}
        </Snippet>
        <Text>This way we render the product is found or redirect the user to a 404 page otherwise.</Text>
        <Text>Now lets handle the rewrite logic in <Code>/pages/product/[id]/_middleware.js</Code> :</Text>
        <Snippet>{`import { NextResponse } from 'next/server'

import api from "../../../api"

export async function middleware(req) {
  // Get the product id from the URL
  const [,, id] = req.nextUrl.pathname.split('/')

  // Check on upstash if we have stock
  const hasStock = await api.cache.get(id)

  // Rewrite to the correct url
  return NextResponse.rewrite(
    hasStock
      ? \`/product/\${id}/\` 
      : \`/product/\${id}/no-stock\`
  )
}
`}
        </Snippet>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-6">
        <Text>Go to this products and play around with their stock, you should be rewrited correctly based on its stock.</Text>
        <article className="flex flex-col gap-3">
          {products.map(product => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <ProductCard product={product} />
            </Link>
          ))}
        </article>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
