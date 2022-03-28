import { useUserState } from '../hooks/useUser'

import { CheckIcon } from '@heroicons/react/outline'
import { Text, Link, Button, LoadingDots } from '@vercel/examples-ui'

export const features = [
  'Exclusive merchandise content',
  'Events and conferences',
  'First access to new feature releases',
]

export const Info = () => {
  const { handleDisconnect, loading, userState, handleConnect } = useUserState()

  const handleLogin = () => {
    handleConnect()
  }

  const noMetamask = userState === 'noMetamask'
  const showConnect = userState !== 'noMetamask' && userState !== 'connected'
  const showDisconnect = userState === 'connected'

  return (
    <section className="flex flex-col flex-2 w-full gap-4 text-white">
      <div className="relative p-6 bg-dark-accents-0 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10  rounded-2xl shadow-sm flex flex-col ">
        <div className="flex-1">
          <Text variant="h1" className="text-white">
            Token Gated Content example
          </Text>
          <Text className="text-white mt-6">
            This example shows how you can create Token Gated Content using
            Next.js.{' '}
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
          <div className="mt-10 p-4 rounded bg-gradient-to-r from-dark-accents-2 via-dark-accents-1 to-transparent">
            <Text variant="h2" className="text-2xl text-gray-400">
              Member access
            </Text>
            <Text className="mt-4 text-white">
              You can create exclusive areas of you website and ensure only
              people owning your token have access to it.
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

            <div className="fw-full mt-6 border-t border-dark-accents-4 ">
              {noMetamask && (
                <Link
                  href="https://metamask.io/"
                  target="_blank"
                  className="text-highlight-pink hover:text-highlight-magenta mt-4"
                >
                  Install metamask to use this example →
                </Link>
              )}

              {showDisconnect && (
                <Button
                  variant="ghost"
                  onClick={handleDisconnect}
                  className="text-highlight-pink hover:text-highlight-magenta mt-4"
                >
                  {loading ? <LoadingDots /> : 'Disconnect your wallets →'}
                </Button>
              )}

              {showConnect && (
                <Button
                  variant="ghost"
                  onClick={handleLogin}
                  className="text-highlight-pink hover:text-highlight-magenta mt-4"
                >
                  {loading ? <LoadingDots /> : 'Connect your wallets →'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
