import { useEffect, useState } from 'react'
import { useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi'
import { utils } from 'ethers'
import { usePrevious } from './usePrevious'
import { useRouter } from 'next/router'

type States =
  | 'noMetamask'
  | 'notConnected'
  | 'wrongNetwork'
  | 'signature'
  | 'connected'

/**
 * connecting flow
 * 1. check if metamask is installed
 * 2. check if metamask is connected
 * 3. check if using the right network
 * 4. check if user signed already or sign
 * 5. validate user ownership of the token
 * 6. redirect to the member area
 */
export const useUserState = (route?: string) => {
  const router = useRouter()
  // wagmi hooks that handle talking to metamask
  const [{ data }, disconnect] = useAccount()
  const [{ error: signError }, signMessage] = useSignMessage()
  const [{ data: connectData, error: connectError }, connect] = useConnect()
  const [{ data: networkData, error: networkError }, switchNetwork] =
    useNetwork()

  // states that are used to control the UI
  const [state, setState] = useState<States>('notConnected')
  const [signature, setSignature] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSigning, setIsSigning] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)

  const previousWalletState = usePrevious(data?.address)
  const prevUserState = usePrevious(state)

  // derived conditions as to what the UI should show

  const shouldSign = state === 'signature' && loading && !isSigning

  const shouldSwitchNetwork =
    state === 'wrongNetwork' && loading && !isSwitching

  const shouldValidateToken = state === 'connected' && loading

  // effects watching wagmi state to reflect the UI
  useEffect(() => {
    if (!window.ethereum) {
      setState('noMetamask')
      return
    }

    // wagmi starts undefined, so we need to wait for it to hydrate
    if (previousWalletState && !data?.address) {
      setState('notConnected')
      handleInvalidateToken()
      return
    }

    // assess the correct state of the user first for early connection when possible
    if (data?.address && networkData.chain?.name === 'Rinkeby' && signature) {
      setState('connected')
      return
    }
    // if we're connected the next step is to check if we're on the right network
    if (data?.address && networkData.chain?.name !== 'Rinkeby') {
      setState('wrongNetwork')
      return
    }

    // if we're on the right network, we need to check if we're signed
    if (data?.address && networkData.chain?.name === 'Rinkeby') {
      const localData = localStorage.getItem('userApproval')
      if (localData) {
        const signedWith = utils.verifyMessage(
          `I approve connecting to ${process.env.NEXT_PUBLIC_APP_NAME}`,
          localData
        )

        if (signedWith === data?.address) {
          setSignature(localData)
          return
        }
      }
      setState('signature')
      return
    }
  }, [data?.address, networkData.chain?.name, signature])

  useEffect(() => {
    if (connectError || networkError || signError) {
      setLoading(false)
    }
  }, [connectError, networkError, signError])

  // effects controlling flows after the login
  useEffect(() => {
    if (shouldSign) {
      handleSignature()
    }

    if (shouldSwitchNetwork) {
      handleSwitchNetwork()
    }

    if (shouldValidateToken) {
      handleValidateToken()
    }
  }, [state, prevUserState])

  const handleSignature = async () => {
    setIsSigning(true)
    const localData = localStorage.getItem('userApproval')
    if (localData) {
      const signedWith = utils.verifyMessage(
        `I approve connecting to ${process.env.NEXT_PUBLIC_APP_NAME}`,
        localData
      )

      if (signedWith === data?.address) {
        setSignature(localData)
        setIsSigning(false)
        return
      }
    }

    const { data: signature } = await signMessage({
      message: `I approve connecting to ${process.env.NEXT_PUBLIC_APP_NAME}`,
    })

    if (signature) {
      localStorage.setItem('userApproval', signature)
      setSignature(signature)
      setIsSigning(false)
    }
  }

  const handleSwitchNetwork = async () => {
    if (switchNetwork) {
      setIsSwitching(true)
      await switchNetwork(4)
      setIsSwitching(false)
    }
  }

  const handleConnect = async () => {
    setLoading(true)
    if (state === 'notConnected') {
      try {
        await connect(connectData?.connectors[0])
      } catch (e) {
        setLoading(false)
      }
    }

    if (state === 'wrongNetwork') {
      await handleSwitchNetwork()
      return
    }

    if (state === 'signature') {
      handleSignature()
    }
  }

  const handleDisconnect = () => {
    disconnect()
  }

  const handleValidateToken = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({
        address: data?.address,
        userApproval: signature,
      }),
    })
    router.reload()
  }

  const handleInvalidateToken = async () => {
    setLoading(true)

    localStorage.removeItem('userApproval')
    setSignature(null)
    await fetch('/api/auth', {
      method: 'DELETE',
    })
    router.reload()
  }

  return {
    handleMessage: handleSignature,
    handleSwitchNetwork,
    handleConnect,
    handleDisconnect,
    userState: state,
    loading,
  }
}
