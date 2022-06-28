import type { GetStaticProps } from 'next'
import type { Product } from '../types'
import type { FC } from 'react'

import Image from 'next/image'
import { Layout, Text, Page, Code, Link } from '@vercel/examples-ui'
import api from '../api'
import ProductCard from '../components/ProductCard'

import notOptimizing from '../public/no-optimizing-board.jpg'
import optimizing from '../public/optimizing-board.jpg'

interface Props {
  products: Product[]
}

const Snippet: FC<{ children: string }> = ({ children }) => {
  return (
    <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 transition-all">
      {children}
    </pre>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list()

  return {
    props: {
      products,
    },
  }
}

function Home({ products }: Props) {
  return (
    <Page>
      <section className="flex flex-col gap-6">
        <Text variant="h1">Rewriting at the edge using Upstash</Text>
        <Text>
          It&apos;s a common case to have a details page of a product or item
          and request our database for stock every time a user requests the page
          (even if our page is using ISR and we fetch the stock client side).
        </Text>
        <Text>
          Sometimes we don&apos;t have stock but we still hit our DB (API then
          DB if doing CSR), which can take a good amount of time depending on
          where the source and our API are and it can be expensive depending on
          how many requests for that page we have.
        </Text>
        <Text>
          We can get faster responses using the edge, by storing and checking in
          Redis if we have ran out of stock for a product and rewriting to a
          previously generated static no-stock page for that specific product.
          That way we reduce the amount of connections to our database, avoid
          uninteractive page due to disabled buy buttons while checking stock
          and reduce content changes when the UI has to change if there&apos;s
          no stock, all while having low latency by embracing the edge.
        </Text>
        <Text>
          Imagine the next flow of an e-commerce site product details page:
        </Text>
        <Image
          src={notOptimizing}
          alt="Graph showing the not optimized inventory flow"
        />
        <Text>
          Now, lets check at the edge if we have stock using Upstash (a Redis
          service) and rewrite to the correct page:
        </Text>
        <Image
          src={optimizing}
          alt="Graph showing the optimized flow using middleware"
        />
        <Text>
          Thats it, we only have to toggle the flag when we add an item or run
          out of stock.
        </Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        <Text variant="h2">Implementing the solution</Text>
        <Text>
          For this example we will have 3 files related to the product details
          page. <Code>/pages/product/[id]/no-stock.js</Code>,{' '}
          <Code>/pages/product/[id]/index.js</Code> and{' '}
          <Code>/middleware.js</Code>.
        </Text>
        <Text>
          Lets start with our <Code>/pages/product/[id]/index.js</Code>:
        </Text>
        <Snippet>
          {`export const getStaticProps = async ({params}) => {
  const product = await api.fetch(params.id)

  if (!product) {
    return {
      notFound: true
    }
  }

  return {
    revalidate: 10,
    props: {
      product
    }
  }
}`}
        </Snippet>
        <Text>
          This way we render the product is found or redirect the user to a 404
          page otherwise.
        </Text>
        <Text>
          Now lets handle the rewrite logic in <Code>/middleware.js</Code> :
        </Text>
        <Snippet>
          {`import { NextResponse } from 'next/server'
import api from './api'

export const config = {
  matcher: '/product/:path',
}

export async function middleware(req) {
  // Extract id from pathname
  const [, , id] = req.nextUrl.pathname.split('/')

  // Check on upstash if we have stock
  const hasStock = await api.cache.get(id)

  // Rewrite to the correct url
  req.nextUrl.pathname = hasStock
    ? \`/product/\${id}/\`
    : \`/product/\${id}/no-stock\`

  // Return rewrited path
  return NextResponse.rewrite(req.nextUrl)
}

`}
        </Snippet>
        <Text>
          Now we will only get to the details screen if we have stock.
        </Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-6">
        <Text>
          Go to this products and play around with their stock and you will be
          rewrited to the correct page.
        </Text>
        <article className="flex flex-col gap-3">
          {products.map((product) => (
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
