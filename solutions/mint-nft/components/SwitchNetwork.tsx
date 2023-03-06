import { useState } from 'react'
import { NETWORK_ID } from '../helpers/constant.helpers';
import { useSwitchNetwork, useNetwork } from 'wagmi';
import { Button, Text, LoadingDots } from '@vercel/examples-ui';

export const SwitchNetwork: React.VFC = () => {
  const { chain } = useNetwork();
  const { isLoading, switchNetwork } = useSwitchNetwork()

  const handleSwitchNetwork = async () => {
    try {
      if (chain?.id !== NETWORK_ID) {
        switchNetwork?.(NETWORK_ID)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col">
      <Text variant="h2">Connecting to Goerli</Text>
      <div className="mt-2 flex flex-col items-start justify-between">
        <Text>
          This example uses the Ethereum test network called Goerli. You must
          set your wallet to use this network before you can mint an NFT.
        </Text>
        <div className="mt-5 sm:flex-shrink-0 sm:flex sm:items-center">
          <Button onClick={handleSwitchNetwork} size="lg" variant="black">
            {isLoading ? <LoadingDots /> : 'Switch to Goerli'}
          </Button>
        </div>
      </div>
    </div>
  )
}
