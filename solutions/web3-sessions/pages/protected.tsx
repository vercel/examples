import { Layout, Text, Page, Button } from '@vercel/examples-ui'
import { getSession } from 'next-auth/react'
import { NextPageContext } from 'next'

import { useProtected } from '../hooks/useProtected'
import { Snippet } from '../components/Snippet'

function Protected() {
  const handleLogout = useProtected()

  return (
    <Page>
      <section className="flex flex-col gap-6">
        <Text variant="h1">Web3 Session with NextAuth.js, Protected Route</Text>
        <Text>
          We are now connected using our metamask account and can access
          connected routes. However, users can manually disconnect from the
          Metamask interface. To make sure we log them out, we can create a
          custom hook.
        </Text>
        <Snippet>{`export function useProtected() {
  const [{ data: accountData }, disconnect] = useAccount()
  const session = useSession()
  const address = accountData?.address
  const prevAddress = usePrevious(accountData?.address)

  const handleSignout = async () => {
    await disconnect()
    signOut({ callbackUrl: '/' })
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
`}</Snippet>
        Now, we can use our hook in our Protected route to handle logout and
        watch users disconnect from the Metamask interface.
        <Text>We can also protect the route in server side props:</Text>
        <Snippet>{`export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}
`}</Snippet>
        <Button onClick={handleLogout}>Logout</Button>
      </section>
    </Page>
  )
}

Protected.Layout = Layout

export default Protected

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}
