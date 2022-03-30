import { useUserState } from '../hooks/useUser'

import { CheckIcon } from '@heroicons/react/outline'
import { Text, Link, Button, LoadingDots } from '@vercel/examples-ui'

export const features = [
  'Exclusive merchandise content',
  'Events and conferences',
  'Communities and forums',
  'First access to new features',
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
    <section className="flex flex-col flex-2 w-full gap-4 ">
      <div className="relative bg-clip-padding  bg-opacity-10  rounded-2xl  flex flex-col ">
        <div className="flex-1">
          <Text variant="h1" className="">
            Token-Gated Content
          </Text>
          <Text className=" mt-6">
            This example shows how you can create exclusive areas of your
            website using Next.js Next.js.{' '}
            <Link
              href="https://github.com/tmm/wagmi"
              target="_blank"
              className="text-highlight-pink hover:text-highlight-magenta"
            >
              Wagmi
            </Link>{' '}
            and{' '}
            <Link
              className="text-highlight-pink hover:text-highlight-magenta"
              href="https://docs.ethers.io/v5/"
              target="_blank"
            >
              Ethers
            </Link>
            . For the example, connecting a metamask wallet will demonstrate how
            token-gated content works for token holders.
          </Text>
          <div className="mt-4 p-4 bg-white rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 border border-gray-100">
            <Text variant="h2" className="text-2xl text-gray-400">
              Access
            </Text>
            <Text className="mt-4 ">
              Token-gating content requires people to have the token you own to
              see exclusive content on your website.
            </Text>
            <Text className="mt-6">You can use token-gated content for:</Text>
            <ul role="list" className="space-y-6">
              {features.map((feature) => (
                <li key={feature} className="flex mt-2">
                  <CheckIcon
                    className="flex-shrink-0 w-6 h-6 "
                    aria-hidden="true"
                  />
                  <span className="ml-3 ">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="fw-full mt-6 border-t border-accents-3 ">
              {noMetamask && (
                <Button
                  variant="ghost"
                  className="text-highlight-pink hover:text-highlight-magenta mt-4"
                >
                  <Link href="https://metamask.io/">
                    Install metamask to view the live example →
                  </Link>
                </Button>
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
