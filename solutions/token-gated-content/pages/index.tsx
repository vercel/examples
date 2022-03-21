import Head from 'next/head'
import { useUserState } from '../hooks/useUser'

import { CheckIcon } from '@heroicons/react/outline'
import {
  Text,
  Button,
  LoadingDots,
  Link,
  Layout,
  Page,
} from '@vercel/examples-ui'

export const features = [
  'Exclusive merchandise content',
  'Events and conferences',
  'First access to new feature releases',
]
function Home() {
  const { userState, loading, handleConnect } = useUserState()
  return (
    <Page>
      <Head>
        <title>Token Gated Content - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example showing how to use NFT token gated content"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">Token Gated Content example</Text>
        <Text>
          This example shows how you can create Token Gated Content using
          Next.js.{' '}
          <Link href="https://github.com/tmm/wagmi" target="_blank">
            Wagmi
          </Link>{' '}
          is used to connect to different wallets and{' '}
          <Link
            href="https://docs.ethers.io/v5/"
            target="
          _blank"
          >
            Ethers
          </Link>{' '}
          is used to interact with the blockchain.
        </Text>
      </section>

      <section className="flex flex-col gap-3 mt-6">
        <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
          <div className="flex-1">
            <Text variant="h2">Member Access</Text>

            <Text className="mt-6">
              You can create exclusive areas of you website and ensure only
              people owning your token have access to it. Examples:
            </Text>

            <ul role="list" className="mt-6 space-y-6">
              {features.map((feature) => (
                <li key={feature} className="flex">
                  <CheckIcon
                    className="flex-shrink-0 w-6 h-6 text-indigo-500"
                    aria-hidden="true"
                  />
                  <span className="ml-3 text-gray-500">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {userState === 'noMetamask' ? (
            <span className="flex justify-center w-full mt-6">
              <Link href="https://metamask.io/" target="_blank">
                Install metamask to use this example
              </Link>
            </span>
          ) : (
            <Link href="/member" className="block w-full mt-6">
              Access member area
            </Link>
          )}
        </div>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
