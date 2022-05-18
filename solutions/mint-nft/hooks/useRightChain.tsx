import { useEffect, useState } from 'react'
import { useChain } from 'react-moralis'
import { NETWORK_ID } from '../helpers/constant.helpers'

export const useRightChain = () => {
  const [isRightChain, setIsRightChain] = useState(true)
  const { switchNetwork, chainId } = useChain()

  const handleSwitchNetwork = () => {
    if (
      typeof chainId !== 'undefined' &&
      typeof switchNetwork !== 'undefined'
    ) {
      switchNetwork(NETWORK_ID)
    }
  }

  useEffect(() => {
    if (chainId) setIsRightChain(chainId === NETWORK_ID)
  }, [chainId])

  return { isRightChain, handleSwitchNetwork }
}
