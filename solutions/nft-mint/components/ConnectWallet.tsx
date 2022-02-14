import { useState } from 'react'
import { useMoralis } from 'react-moralis'
import { useConnect } from 'wagmi'

import { Button, Text, LoadingDots } from '@vercel/examples-ui'

export const ConnectWallet: React.VFC = () => {
  const [loading, setLoading] = useState(false)

  const [{ data: connectData }, connect] = useConnect()

  const { authenticate } = useMoralis()

  const handleConnect = async () => {
    setLoading(true)
    await authenticate({
      signingMessage: 'Authorize linking of your wallet to',
    })
    await connect(connectData.connectors[0])
    setLoading(false)
  }

  return (
    <div className="px-4 py-5 sm:p-6 flex flex-col ">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Connecting your wallet
      </h3>
      <div className="mt-2 items-start justify-between">
        <Text className="max-w-xl text-sm text-gray-500">
          In order to mint your NFT you must connect your wallet using the{' '}
          <a className="underline" href="https://metamask.io/" target="_blank">
            Metamask extension.
          </a>{' '}
          This will also be used to authenticate you to{' '}
          <a href="https://moralis.io/" className="underline" target="_blank">
            Moralis
          </a>{' '}
          anonymously.
        </Text>
        <div className="mt-12  flex justify-center">
          <Button
            type="button"
            size="lg"
            variant="black"
            onClick={handleConnect}
          >
            {loading ? <LoadingDots /> : 'Connect Wallet'}
          </Button>
        </div>
      </div>
    </div>
  )
}
