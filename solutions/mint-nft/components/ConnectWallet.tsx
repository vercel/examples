import { Button, Text, LoadingDots } from '@vercel/examples-ui'
import { useConnect, useDisconnect, useAccount, useSignMessage } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { signIn } from 'next-auth/react';
import axios from 'axios';

export const ConnectWallet: React.VFC = () => {
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected, isConnecting } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const handleConnect = async () => {
    //disconnects the web3 provider if it's already active
    if (isConnected) {
      await disconnectAsync();
    }
    // enabling the web3 provider metamask
    const { account, chain } = await connectAsync({ connector: new InjectedConnector() });

    const userData = { address: account, chain: chain.id, network: 'evm' };
    // making a post request to our 'request-message' endpoint
    const { data } = await axios.post('/api/auth/request-message', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const message = data?.message;
    // signing the received message via metamask
    const signature = await signMessageAsync({ message });

    // redirect user after success authentication to '/user' page
    await signIn('credentials', { message, signature, redirect: false, callbackUrl: '/user' }) ?? {};
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
            {isConnecting ? <LoadingDots /> : "Connect Wallet"}
          </Button>
        </div>
      </div>
    </div>
  )
}
