import { useMoralis } from 'react-moralis'
import { Button, Text, LoadingDots } from '@vercel/examples-ui'

export const ConnectWallet: React.VFC = () => {
  const { authenticate, isAuthenticating } = useMoralis()

  const handleConnect = () => {
    authenticate({
      signingMessage: 'Authorize linking of your wallet to',
    })
  }

  return (
    <div className="flex flex-col ">
      <Text variant="h2">Connecting your wallet</Text>
      <div className="mt-2 items-start justify-between">
        <Text className="my-6">
          In order to mint your NFT you must connect your wallet using the{' '}
          <a
            className="underline"
            href="https://metamask.io/"
            target="_blank"
            rel="noreferrer"
          >
            Metamask extension.
          </a>{' '}
          This will also be used to authenticate you to{' '}
          <a
            href="https://moralis.io/"
            className="underline"
            target="_blank"
            rel="noreferrer"
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
            {isAuthenticating ? <LoadingDots /> : 'Connect Wallet'}
          </Button>
        </div>
      </div>
    </div>
  )
}
