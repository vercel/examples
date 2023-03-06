import { useState } from "react";
import { Button, Text, LoadingDots } from '@vercel/examples-ui'
import { useConnect, useDisconnect, useAccount, useSignMessage } from 'wagmi';
import { signIn } from 'next-auth/react';
import { useAuthRequestChallengeEvm } from '@moralisweb3/next';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { useRouter } from 'next/router';

export const ConnectWallet: React.VFC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();
  const { push } = useRouter();

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      //disconnects the web3 provider if it's already active
      if (isConnected) {
        await disconnectAsync();
      }
      // enabling the web3 provider metamask
      const { account, chain } = await connectAsync({ connector: new MetaMaskConnector() });

      const userData = { address: account, chainId: chain.id };
      const payload = `Authentication time: ${Date.now()}`;
      const { message = "" } = (await requestChallengeAsync(userData)) ?? {};
      // signing the received message via metamask
      const signature = await signMessageAsync({ message });

      setIsLoading(false);

      await signIn('moralis-auth', { message, signature, payload, redirect: false });

      push('/');
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
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
          <Button
            variant="black"
            size="lg"
            disabled={isLoading}
            onClick={handleConnect}
          >
            {isLoading ? <LoadingDots /> : "Connect Wallet"}
          </Button>
        </div>
      </div>
    </div>
  )
}
