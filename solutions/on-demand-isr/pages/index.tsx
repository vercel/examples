import type { Product } from '../types'

import {
  Layout,
  Text,
  Page,
  Code,
  Link,
  Button,
  Snippet,
} from '@vercel/examples-ui'

import { GetStaticProps } from 'next'
import api from '../api'
import Image from 'next/image'

interface Props {
  products: Product[]
  date: string
}

const ProductCard: React.VFC<{ product: Product }> = ({ product }) => {
  return (
    <div
      className={`flex flex-col shadow-lg overflow-hidden relative ${
        product.hasStock ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
      }`}
    >
      <Image
        layout="responsive"
        width="100"
        height="48"
        objectFit="cover"
        src={product.image}
        alt=""
      />
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <p className="text-sm leading-5 font-medium text-indigo-600 uppercase tracking-wide text-sm text-indigo-600 font-bold">
            {product.category}
          </p>
          <h3 className="mt-2 text-xl leading-7 font-semibold text-gray-900">
            {product.title}
          </h3>
          <p className="mt-2 text-base leading-6 text-gray-500">
            {product.description}
          </p>
        </div>
        <div className="mt-4 text-xl leading-none font-extrabold text-gray-900">
          <span>{product.hasStock ? product.price : 'Not available'}</span>
        </div>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list()

  return {
    props: {
      products,
      date: new Date().toTimeString(),
    },
  }
}

function Home({ products, date }: Props) {
  async function handleRevalidate() {
    await fetch('/api/revalidate')

    window.location.reload()
  }

  return (
    <Page>
      <section className="flex flex-col gap-6">
        <Text variant="h1">On demand ISR usage example</Text>
        <Text>
          Next.js allows you to create or update static pages after you’ve built
          your site. Incremental Static Regeneration (ISR) enables you to use
          static-generation on a per-page basis, without needing to rebuild the
          entire site. With ISR, you can retain the benefits of static while
          scaling to millions of pages.
        </Text>
        <Snippet>
          {`// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  return {
    props: {
      posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  }
}`}
        </Snippet>
        <Text>
          Would not be great if we only regenerate this page when our data
          changes? Since Next.js 12.2.0 we can do that using the{' '}
          <Code>res.revalidate</Code> function in our{' '}
          <Link href="https://nextjs.org/docs/api-routes/introduction">
            API Routes
          </Link>
          .
        </Text>
        <Snippet>
          {`export default async function handler(_req, res) {
  // Revalidate our '/' path
  await res.revalidate('/')

  // Return a response to confirm everything went ok
  return res.json({revalidated: true})
}
`}
        </Snippet>
        <Text>
          Calling this API route will revalidate our content on demand, not just
          purging the old content but running <Code>getStaticProps</Code> again,
          generating new content and caching it for the next user, allowing us
          to increment or even remove the time revalidation in our pages. On
          demand revalidation might be useful for commerce providers, webhooks,
          bots, etc. That might fire when our content has been changed.
        </Text>
        <Text>
          Calling <Code>revalidate</Code> will run <Code>getStaticProps</Code>{' '}
          for that path synchronously so we can <Code>await</Code> it. If you
          need to revalidate multiple paths you will need to run{' '}
          <Code>revalidate</Code> once for every path:
        </Text>
        <Snippet>
          {`export default async function handler(_req, res) {
  // Get paths to revalidate
  const paths = await api.pathsToRevalidate()

  // Revalidate every path
  await Promise.all(paths.map(res.revalidate))

  // Return a response to confirm everything went ok
  return res.json({revalidated: true})
}
`}
        </Snippet>
        <Text>
          We have to also keep in mind that revalidating a path will run the{' '}
          <Code>getStaticProps</Code> serverless function for that specific
          path, which will count for our{' '}
          <Link href="https://vercel.com/docs/concepts/limits/overview#typical-monthly-usage-guidelines">
            function execution time
          </Link>
          . Also awaiting for every path to revalidate on our API route will
          make it run longer and that will also count for our function execution
          time.
        </Text>
        <Text>
          Depending on you application needs you might not need to wait for that
          validation to end and you can do a fire and forget request for those
          paths:
        </Text>
        <Snippet>
          {`export default async function handler(_req, res) {
  // Get paths to revalidate
  const paths = await api.pathsToRevalidate()

  // Revalidate every path without awaiting
  paths.forEach(res.revalidate)

  // Return a response to confirm everything went ok
  return res.json({revalidated: true})
}
`}
        </Snippet>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-6">
        <Text variant="h2">Demo</Text>
        <Text>
          This demo was generated on <Code>{date}</Code>, product prices and
          stock might have changed since then. You can try revalidating this
          content.
        </Text>
        <Text>Click here to revalidate:</Text>
        <Button onClick={handleRevalidate} className="w-fit" variant="black">
          Revalidate
        </Button>
        <Text>Or call the revalidate endpoint:</Text>
        <Button
          className="w-fit"
          href="/api/revalidate"
          Component="a"
          variant="black"
        >
          /api/revalidate
        </Button>

        <hr className="border-t border-accents-2 my-6" />

        <article className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </article>

        <Text>
          Remember to always be careful when exposing endpoints as they may be
          vulnerable to DDOS attacks. You can request a key, token, etc. to
          protect the endpoint from unwanted requests.
        </Text>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
