import { useSession, signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { usePrevious } from './usePrevious'

export function useProtected() {
  const [{ data: accountData }, disconnect] = useAccount()
  const session = useSession()
  const address = accountData?.address
  const prevAddress = usePrevious(accountData?.address)

  const handleSignout = async () => {
    await signOut({ callbackUrl: '/' })
    await disconnect()
  }

  useEffect(() => {
    if (prevAddress && !address) {
      handleSignout()
    }
    if (session.status !== 'loading' && !address && prevAddress) {
      handleSignout()
    }
  }, [accountData, address])

  return handleSignout
}
