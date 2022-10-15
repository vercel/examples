import type { GetStaticProps } from 'next'
import type { Product } from '../types'
import type { FC, ReactNode } from 'react'

import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import Image from 'next/image'
import { Layout, Text, Page, Code, Link, List } from '@vercel/examples-ui'
import api from '../api'
import ProductCard from '../components/ProductCard'

import notOptimizing from '../public/not-optimizing-board.jpg'
import pageOptimizing from '../public/page-optimizing-board.jpg'
import appOptimizing from '../public/cross-page-optimizing-board.jpg'

interface Props {
  products: Product[]
}

const Snippet: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 transition-all">
      {children}
    </pre>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list()

  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    await api.cache.set(products)
  }

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
        <Text variant="h1">Reusing responses at build time</Text>
        <Text>
          In some applications, like an e-commerce we have to query our database
          for <Code>list</Code> and <Code>fetch</Code> operations that returns
          the same data schema. But given that we usually have to call this
          methods inside <Code>getStaticProps</Code> and{' '}
          <Code>getStaticPaths</Code> we end up querying our services way more
          times than needed.
        </Text>
        <Text>
          Imagine the following scenario. We have an e-commerce with 100
          products and two routes that we statically generate at build time, an{' '}
          <Code>/</Code> route that list all the products and a{' '}
          <Code>/[id]</Code> route that shows the product details. We asume that
          we have an endpoint that returns all the products with the relevant
          data we need to pre-render our page. Every roundtrip to our service
          takes 150ms and consumes 1kb of bandwidth per product.
        </Text>
        <Text>
          The graph below ilustrates how <Code>getStaticProps</Code> makes a
          call to the DB for the listing page and for each product:
        </Text>
        <Image
          src={notOptimizing}
          alt="A graph showing how fetching products without caching looks like"
        />
        <List>
          <li>
            <span className="font-semibold">getStaticPaths</span>: 100kb
            bandwidth, 150ms execution time, 1 call.
          </li>
          <li>
            <span className="font-semibold">getStaticProps</span>: 100kb
            bandwidth, 15000ms execution time, 100 calls.
          </li>
          <li>
            <span className="font-semibold">Total</span>:{' '}
            <span>200kb bandwidth, 15150ms execution time, 101 calls.</span>
          </li>
        </List>
        <Text>
          But what if we could reuse the response from{' '}
          <Code>getStaticPaths</Code> in our <Code>getStaticProps</Code> calls?
        </Text>
        <Image
          src={pageOptimizing}
          alt="A graph showing how caching product details makes a big difference"
        />
        <List>
          <li>
            <span className="font-semibold">getStaticPaths</span>: 100kb
            bandwidth, 150ms execution time, 1 call.
          </li>
          <li>
            <span className="font-semibold">getStaticProps</span>: 0kb
            bandwidth, ~ 0ms execution time. 0 calls.
          </li>
          <li>
            <span className="font-semibold">Total</span>:{' '}
            <span>100kb bandwidth, 150ms execution time, 1 call.</span>
          </li>
        </List>
        <Text>And what if we can reuse that cache at application level?</Text>
        <Image
          src={appOptimizing}
          alt="A graph showing how to cache the products across pages"
        />
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        <Text variant="h2">A real-world example</Text>
        <Text>
          Lets start with some unoptimized code for our <Code>/[id]</Code> page.
        </Text>
        <Snippet>
          {`export const getStaticPaths = async () => {
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
        <Text>
          Lets add a cache using <Code>fs</Code> to share state at build time
          between <Code>getStaticPaths</Code> and <Code>getStaticProps</Code>.
          We will add a <Code>cache</Code> property to <Code>api</Code> with a{' '}
          <Code>get</Code> and a <Code>set</Code> method to interact with the
          cache.
        </Text>
        <Snippet>
          {`const api = {
  list: async () => {
    return PRODUCTS
  },
  fetch: async (id: Product['id']) => {
    return PRODUCTS.find((product) => product.id === id)
  },
  cache: {
    get: async (id: string): Promise<Product | null | undefined> => {
      const data = await fs.readFile(path.join(process.cwd(), 'products.db'))
      const products: Product[] = JSON.parse(data as unknown as string)

      return products.find((product) => product.id === id)
    },
    set: async (products: Product[]) => {
      return await fs.writeFile(
        path.join(process.cwd(), 'products.db'),
        JSON.stringify(products)
      )
    },
  },
}`}
        </Snippet>
        <Text>
          And we will use this methods in <Code>getStaticPaths</Code> and{' '}
          <Code>getStaticProps</Code>:
        </Text>
        <Snippet>
          {`export const getStaticPaths = async () => {
  const products = await api.list()

  await api.cache.set(products)

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
  let product = await cache.get(params.id);

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
        <Text>
          That way we ensure to use always information cache-first and if we
          don&apos;t find it, we fallback to calling the API. If you want to
          optimize this to be cross-page you can move the cache to other file
          and reuse it.
        </Text>
        <Text>
          But there is something else we should take care of. Our current code
          might collide with our revalidation process in case we do ISR, so we
          want to ensure to only read from cache if we are at build time.
        </Text>
        <Snippet>
          {`import { PHASE_PRODUCTION_BUILD } from 'next/constants';
...

export const getStaticPaths = async () => {
  const products = await api.list()

  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    await api.cache.set(products)
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
  let product = await cache.get(params.id);

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
        <Text>
          Now we check if <Code>NEXT_PHASE</Code> is{' '}
          <Code>PHASE_PRODUCTION_BUILD</Code> so we know we only write to cache
          at build time. If you want to always cache build-time responses
          instead of manually caching at page level, you can move the usage of
          the cache methods to the level needed for your application.
        </Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-6">
        <Text>
          This is a list to our products, each one will redirect to the{' '}
          <Code>/[id]</Code> route that was generated reusing responses from the
          cache at build time.
        </Text>
        <article className="flex flex-col gap-3">
          {products.map((product) => (
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
