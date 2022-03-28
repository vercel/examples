import Head from 'next/head'
import { useUserState } from '../hooks/useUser'

import { CheckIcon } from '@heroicons/react/outline'
import {
  Text,
  Link,
  Layout,
  Page,
  Button,
  LoadingDots,
} from '@vercel/examples-ui'
import { GetStaticProps } from 'next'
import { Product, ProductCard } from '../components/ProductCard'

export const features = [
  'Exclusive merchandise content',
  'Events and conferences',
  'First access to new feature releases',
]

type Props = {
  product: Product
}

function Home({ product }: Props) {
  const { handleDisconnect, loading, userState } = useUserState()

  const handleLogout = () => {
    handleDisconnect()
  }

  return (
    <main className={`px-24 py-12`}>
      <Head>
        <title>Token Gated Content - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example showing how to use NFT token gated content"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mx-auto px-4  sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-rows-1 lg:grid-cols-8 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          <div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-4">
            <section className="flex flex-col flex-2 w-full gap-4 text-white">
              <div className="relative p-6 bg-dark-accents-0 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10  border border-gray-200 rounded-2xl shadow-sm flex flex-col ">
                <div className="flex-1">
                  <Text variant="h1" className="text-white">
                    Token Gated Content example
                  </Text>
                  <Text className="text-white mt-6">
                    This example shows how you can create Token Gated Content
                    using Next.js.{' '}
                    <Link
                      href="https://github.com/tmm/wagmi"
                      target="_blank"
                      className="text-highlight-pink hover:text-highlight-magenta"
                    >
                      Wagmi
                    </Link>{' '}
                    is used to connect to different wallets and{' '}
                    <Link
                      className="text-highlight-pink hover:text-highlight-magenta"
                      href="https://docs.ethers.io/v5/"
                      target="_blank"
                    >
                      Ethers
                    </Link>{' '}
                    is used to interact with the blockchain.
                  </Text>

                  <Text className="mt-6 text-white">
                    You can create exclusive areas of you website and ensure
                    only people owning your token have access to it.
                  </Text>
                  <Text className="mt-6">Examples:</Text>
                  <ul role="list" className="space-y-6">
                    {features.map((feature) => (
                      <li key={feature} className="flex mt-2">
                        <CheckIcon
                          className="flex-shrink-0 w-6 h-6 text-white"
                          aria-hidden="true"
                        />
                        <span className="ml-3 text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="fw-full mt-6 border-t border-dark-accents-4 ">
                  {userState === 'noMetamask' ? (
                    <Link
                      href="https://metamask.io/"
                      target="_blank"
                      className="text-highlight-pink hover:text-highlight-magenta mt-4"
                    >
                      Install metamask to use this example →
                    </Link>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="text-highlight-pink hover:text-highlight-magenta mt-4"
                    >
                      {loading ? <LoadingDots /> : 'Disconnect your wallets →'}
                    </Button>
                  )}
                </div>
              </div>
            </section>
          </div>

          <div className="lg:row-end-1 lg:col-span-4 mt-6 lg:mt-0 h-full flex flex-col ">
            <div className="aspect-w-3 aspect-h-2 rounded-lg bg-gray-900 overflow-hidden">
              <ProductCard product={product} blur={false} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

Home.Layout = Layout

export default Home

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      product: {
        id: 'mug-nextjs',
        title: 'Vercel Mug',
        description: 'Limited Edition',
        image: '/mug2.png',
        price: 150,
        stock: 0,
      },
    },
  }
}

{
  /* <section className="w-full flex flex-23items-center justify-center">
<ProductCard product={product} blur={false} />
</section> */
}
