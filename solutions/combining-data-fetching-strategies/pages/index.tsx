import Image from 'next/image'
import { Layout, Text, Page, Code, Link, List } from '@vercel/examples-ui'
import { GetStaticProps } from 'next'
import useSWR from 'swr'
import { useEffect, useState } from 'react'

import board from '../public/board.jpg'

interface Product {
  id: string
  title: string
  description: string
  image: string
  price: string
  stock: number
}

interface Props {
  product: Product
}

const fetcher = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json())

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      product: {
        id: 'mug-nextjs',
        title: 'Vercel Mug',
        description: 'Limited Edition',
        image: '/mug.png',
        price: 150,
        stock: 5,
      },
    },
  }
}

function ProductCard({ product }: Props) {
  const [isAdded, toggleAdded] = useState<boolean>(false)
  const { data: stock } = useSWR(`/api/product/${product.id}/stock`, fetcher, {
    refreshInterval: 5000,
  })
  const isLoading = stock === undefined

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isAdded) {
      timeout = setTimeout(() => {
        toggleAdded(false)
      }, 1500)
    }

    return () => clearTimeout(timeout)
  }, [isAdded])

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="ml-14 lg:ml-24 -mb-40 lg:-mb-56">
        <Image
          className="pointer-events-none"
          alt={product.title}
          src={product.image}
          width="440"
          height="440"
          layout="responsive"
        />
      </div>
      <section className="border border-gray-300 bg-white rounded-lg shadow-lg mt-16 w-full hover:shadow-2xl transition pt-16 lg:pt-24">
        <div className="p-4 flex flex-col justify-center items-center border-b">
          <div className="flex justify-between w-full items-baseline">
            <div className="ml-4 mr-auto text-left flex flex-col">
              <h4 className="font-semibold text-xl">{product.title}</h4>
              <h5 className="text-gray-700">
                {product.description} {isLoading ? `` : `(${stock} left)`}
              </h5>
            </div>
            <h4 className="font-bold text-lg">USD {product.price}</h4>
          </div>
        </div>
        <div className="p-4 gap-4 flex flex-col justify-center items-center border-b">
          {isLoading ? (
            <a
              role="button"
              className="py-4 px-6 text-lg w-full bg-gray-500 cursor-not-allowed disabled text-center text-white rounded-md"
            >
              Loading...
            </a>
          ) : (
            <>
              {isAdded ? (
                <a
                  role="button"
                  className="py-4 px-6 text-lg w-full bg-green-500 text-center text-white rounded-md"
                >
                  Added!
                </a>
              ) : (
                <>
                  {stock > 0 ? (
                    <a
                      role="button"
                      onClick={() => toggleAdded(true)}
                      className="py-4 px-6 text-lg w-full bg-black text-center text-white hover:text-white rounded-md hover:bg-gray-900"
                    >
                      Add to cart
                    </a>
                  ) : (
                    <a
                      role="button"
                      className="py-4 px-6 text-lg w-full bg-gray-500 cursor-not-allowed disabled text-center text-white rounded-md"
                    >
                      No stock available
                    </a>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

function Home({ product }: Props) {
  return (
    <Page>
      <section className="flex flex-col gap-6">
        <Text variant="h1">Combining data fetching strategies</Text>
        <Text>
          Next.js has two forms of pre-rendering: Static Generation and
          Server-side Rendering. The difference is in when it generates the HTML
          for a page.
        </Text>
        <List>
          <li>
            <Link href="https://nextjs.org/docs/basic-features/pages#static-generation-recommended">
              Static Generation
            </Link>{' '}
            is the pre-rendering method that generates the HTML at build time.
            The pre-rendered HTML is then reused on each request.
          </li>
          <li>
            <Link href="https://nextjs.org/docs/basic-features/pages#server-side-rendering">
              Server-side Rendering
            </Link>{' '}
            is the pre-rendering method that generates the HTML on each request.
          </li>
        </List>
        <Text>
          Sometimes we need to have data in our page that is not static and we
          tend to move away from <Code>getStaticProps</Code> to{' '}
          <Code>getServerSideProps</Code>.
        </Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        <Text variant="h2">A real-world example</Text>
        <Text>
          We have an e-commerce product page that is statically generated, but
          we need to disable the &quot;Add to cart&quot; button if we have no
          stock. We can combine our data fetching strategies to get the best of
          both worlds. We will still generate our product page statically but we
          will fetch our stock periodically to update our UI.
        </Text>
        <Image
          src={board}
          alt="Graph showing how the page is generated at build time and updated client-side"
        />
        <Text>
          This page is statically generated so you can see the example below. We
          are using <Link href="https://swr.vercel.app">SWR</Link> to fetch the
          stock status every 5 seconds and disable the &quot;Add to cart&quot;
          button if we have no stock. The stock is a random number so you can
          see the button getting disabled and enabled several times.
        </Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        <ProductCard product={product} />
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
