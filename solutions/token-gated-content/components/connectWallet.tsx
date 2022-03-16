import { CheckIcon } from '@heroicons/react/outline'
import { Text, Button, LoadingDots, Link } from '@vercel/examples-ui'

import { useUserState } from '../hooks/useUser'

export const features = [
  'Exclusive merchandise content',
  'Events and conferences',
  'First access to new feature releases',
]

export const ConnectWallet = () => {
  const { handleConnect, loading, userState } = useUserState()
  return (
    <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
      <div className="flex-1">
        <Text variant="h2">Member Access</Text>

        <Text className="mt-6">
          You can create exclusive areas of you website and ensure only people
          owning your token have access to it. Examples:
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

      {userState !== 'noMetamask' ? (
        <Button onClick={handleConnect} className="block w-full mt-4">
          {loading ? <LoadingDots /> : 'Access member area'}
        </Button>
      ) : (
        <span className="flex justify-center w-full mt-6">
          <Link href="https://metamask.io/" target="_blank">
            Install metamask to use this example
          </Link>
        </span>
      )}
    </div>
  )
}
