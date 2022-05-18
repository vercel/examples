import { useState } from 'react'
import { NETWORK_ID } from '../helpers/constant.helpers'

import { Button, Text, LoadingDots } from '@vercel/examples-ui'
import { useChain } from 'react-moralis'

export const SwitchNetwork: React.VFC = () => {
  const [loading, setLoading] = useState(false)

  const { switchNetwork, chainId } = useChain()

  const handleSwitchNetwork = async () => {
    setLoading(true)
    try {
      if (typeof chainId !== 'undefined') {
        await switchNetwork(NETWORK_ID)
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col">
      <Text variant="h2">Connecting to Rinkeby</Text>
      <div className="mt-2 flex flex-col items-start justify-between">
        <Text>
          This example uses the Ethereum test network called Rinkeby. You must
          set your wallet to use this network before you can mint an NFT.
        </Text>
        <div className="mt-5 sm:flex-shrink-0 sm:flex sm:items-center">
          <Button onClick={handleSwitchNetwork} size="lg" variant="black">
            {loading ? <LoadingDots /> : 'Switch to Rinkeby'}
          </Button>
        </div>
      </div>
    </div>
  )
}
