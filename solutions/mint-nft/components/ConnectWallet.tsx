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
    <div className="flex flex-col ">
      <Text variant="h2">Connecting your wallet</Text>
      <div className="mt-2 items-start justify-between">
        <Text className="my-6">
          In order to mint your NFT you must connect your wallet using the{' '}
          <a
            className="underline"
            rel="noreferrer"
            href="https://metamask.io/"
            target="_blank"
          >
            Metamask extension.
          </a>{' '}
          This will also be used to authenticate you to{' '}
          <a
            href="https://moralis.io/"
            rel="noreferrer"
            className="underline"
            target="_blank"
          >
            Moralis
          </a>{' '}
          anonymously.
        </Text>
        <Text>
          Metamask sometimes presents some UX issues where it will not open
          properly. It is good to guide users trough this process to keep
          accessibility in mind.
        </Text>
        <div className="mt-12  flex justify-center">
          <Button variant="black" size="lg" onClick={handleConnect}>
            {loading ? <LoadingDots /> : 'Connect Wallet'}
          </Button>
        </div>
      </div>
    </div>
  )
}
