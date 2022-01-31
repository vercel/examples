import type { GetStaticProps } from 'next'
import type { Product } from '../types'
import type { FC } from 'react'

import Head from 'next/head'
import Image from 'next/image'
import { Layout, Text, Page, Code, Link, List } from '@vercel/examples-ui'
import api from '../api'
import ProductCard from '../components/ProductCard'

import notOptimizing from "../public/not-optimizing-board.jpg"
import pageOptimizing from "../public/page-optimizing-board.jpg"
import appOptimizing from "../public/cross-page-optimizing-board.jpg"

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
        <title>Reusing responses</title>
        <meta name="description" content="How to reduce bandwidth and execution time reusing responses across calls" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">Reusing responses</Text>
        <Text>In some applications, like an e-commerce we have to query our database for <Code>list</Code> and <Code>fetch</Code> operations that returns the same data schema. But given that we usually have to call this methods inside <Code>getStaticProps</Code> and <Code>getStaticPaths</Code> we end up querying our services way more times than needed.</Text>
        <Text>Imagine the following scenario. We have an e-commerce with 100 products and two routes that we statically generate at build time, an <Code>/</Code> route that list all the products and a <Code>/[id]</Code> route that shows the product details. We asume that we have an endpoint that returns all the products with the relevant data we need to pre-render our page. Every roundtrip to our service take 150ms and consumes 1kb of bandwidth per product.</Text>
        <Text>Calling the <Code>/api/product</Code> endpoint in <Code>getStaticPaths</Code> and calling <Code>/api/product/[id]</Code> endpoint in <Code>getStaticProps</Code> for each product:</Text>
        <Image src={notOptimizing} />
        <List>
          <li><span className="font-semibold">getStaticPaths</span>: 100kb bandwidth, 150ms execution time, 1 call.</li>
          <li><span className="font-semibold">getStaticProps</span>: 100kb bandwidth, 15000ms execution time, 100 calls.</li>
          <li>
            <span className="font-semibold">Total</span>: <span>200kb bandwidth, 15150ms execution time, 101 calls.</span>
          </li>
        </List>
        <Text>But what if we could reuse the response from <Code>getStaticPaths</Code> in our <Code>getStaticProps</Code> calls?</Text>
        <Image src={pageOptimizing} />
        <List>
          <li><span className="font-semibold">getStaticPaths</span>: 100kb bandwidth, 150ms execution time, 1 call.</li>
          <li><span className="font-semibold">getStaticProps</span>: 0kb bandwidth, ~ 0ms execution time. 0 calls.</li>
          <li>
            <span className="font-semibold">Total</span>: <span>100kb bandwidth, 150ms execution time, 1 call.</span>
          </li>
        </List>
        <Text>And what if we can reuse that cache at aplication level?</Text>
        <Image src={appOptimizing} />
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        <Text variant="h2">
          A real-world example
        </Text>
        <Text>Lets start with some unoptimized code for our <Code>/[id]</Code> page.</Text>
        <Snippet>{`export const getStaticPaths = async () => {
  const products = await api.list()

  return {
    paths: products.map(product => ({
      params: {
        id: product.id
      },
    })),
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({params}) => {
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
        <Text>Lets add a <Code>Map</Code> to use it as cache.</Text>
        <Snippet>{`const cache = new Map();

export const getStaticPaths = async () => {
  const products = await api.list()

  for (let product of products) {
    cache.set(product.id, product);
  }

  return {
    paths: products.map(product => ({
      params: {
        id: product.id
      },
    })),
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({params}) => {
  let product = cache.get(params.id);

  if (!product) {
    product = await api.fetch(params.id)
  }

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
        <Text>That way we ensure to use always information cache-first and if we don't find it, we fallback to calling the API. If you want to optimize this to be cross-page you can move the cache to other file and reuse it.</Text>
        <Text>But there is something else we should take care of. Our current code might collide with our our revalidation process in case we do ISR, so we want to ensure to only read from cache if we are at build time.</Text>
        <Snippet>{`import { PHASE_PRODUCTION_BUILD } from 'next/constants';
...
const cache = new Map();

export const getStaticPaths = async () => {
  const products = await api.list()

  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    for (let product of products) {
      cache.set(product.id, product);
    }
  }

  return {
    paths: products.map(product => ({
      params: {
        id: product.id
      },
    })),
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({params}) => {
  let product = cache.get(params.id);

  if (!product) {
    product = await api.fetch(params.id)
  }

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
        <Text>Now we check if <Code>NEXT_PHASE</Code> is <Code>PHASE_PRODUCTION_BUILD</Code> so we know we only write to cache at build time.</Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-6">
        <Text>This is a list to our products, each one will redirect to the <Code>/[id]</Code> route that was generated reusing responses from the cache at build time.</Text>
        <article className="flex flex-col gap-3">
          {products.map(product => (
            <Link key={product.id} href={`/${product.id}`}>
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
