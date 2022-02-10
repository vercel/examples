import { useState, useEffect } from 'react'
import Lottie from 'react-lottie-player'
import { useMoralis } from 'react-moralis'
import { useAccount, useConnect, useNetwork } from 'wagmi'

import { getShortenedAddress } from '../helpers/address.helpers'
import { currentChainLabel } from '../helpers/constant.helpers'
import { useRightChain } from '../hooks/useRightChain'
import { NotConnectedAvatar } from './NotConnectedAvatar'

export const ConnectWallet: React.VFC = () => {
  const [avatarAnimationData, setAvatarAnimationData] = useState<any>()
  // start at true since we need the hooks from wagmi to get propagated by metamask before showing wrong chain warning
  const { isRightChain, handleSwitchNetwork } = useRightChain(true)
  const [{ data: connectData }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })
  const { authenticate } = useMoralis()

  useEffect(() => {
    if (accountData?.address && !isRightChain) {
      setTimeout(handleSwitchNetwork, 1500)
    }
  }, [isRightChain, accountData?.address])

  const handleConnect = async () => {
    await authenticate({
      signingMessage: 'Authorize linking of your wallet to',
    })
    await connect(connectData.connectors[0])
  }

  // lazy load avatar animation
  useEffect(() => {
    import('../lottie.avatar.json').then(setAvatarAnimationData)
  }, [])

  return (
    <span className="flex justify-center flex-col items-center">
      <button
        onClick={accountData ? disconnect : handleConnect}
        className="flex-shrink-0 group block"
      >
        <div className="flex items-center">
          <div>
            {accountData ? (
              <Lottie
                animationData={avatarAnimationData}
                style={{ height: 100, width: 100 }}
                play
                loop
              />
            ) : (
              <NotConnectedAvatar />
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              {accountData
                ? getShortenedAddress(accountData.address)
                : 'No Wallet Connected'}
            </p>
            <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
              {accountData ? 'disconnect' : 'connect your wallet'}
            </p>
          </div>
        </div>
      </button>
      {!isRightChain && (
        <button
          onClick={handleSwitchNetwork}
          className="font-extrabold underline text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600"
        >
          Switch to {currentChainLabel}
        </button>
      )}
    </span>
  )
}
