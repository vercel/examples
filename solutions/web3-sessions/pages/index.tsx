import { Layout, Text, Page, Button, Link, Code } from '@vercel/examples-ui'
import { Snippet } from '../components/Snippet'

import { signIn } from 'next-auth/react'
import { useConnect, useAccount } from 'wagmi'

function Home() {
  const [{ data: connectData }, connect] = useConnect()
  const [{ data: accountData }] = useAccount()
  const metamaskInstalled = connectData.connectors[0].name === 'MetaMask'

  const handleLogin = async () => {
    try {
      const callbackUrl = '/protected'
      if (accountData?.address) {
        signIn('credentials', { address: accountData.address, callbackUrl })
        return
      }
      const { data, error } = await connect(connectData.connectors[0])
      if (error) {
        throw error
      }
      signIn('credentials', { address: data?.account, callbackUrl })
    } catch (error) {
      window.alert(error)
    }
  }

  return (
    <Page>
      <section className="flex flex-col space-y-4 gap-6">
        <Text variant="h1">Web3 Sessions with NextAuth.js</Text>
        <Text>
          In a decentralized application, a user is often identified by a
          Cryptocurrency wallet such as{' '}
          <Link href="https://metamask.io/" target="_blank">
            Metamask
          </Link>
          . However, since Metamask works by injecting a script into the page,
          it is only available on the client, cutting off the ability to use{' '}
          <Code>getServerSideProps</Code> to fetch user data.
        </Text>
        <Text>
          We can solve this by pairing a{' '}
          <Link href="https://next-auth.js.org/" target="_blank">
            NextAuth.js
          </Link>{' '}
          session with a convenient hooks library called{' '}
          <Link href="https://github.com/tmm/wagmi" target="_blank">
            WAGMI
          </Link>
          . We will need to configure NextAuth.js with the{' '}
          <Code>CredentialsProvider</Code>:
        </Text>
        <Snippet>
          {`import NextAuth from 'next-auth'
import { utils } from 'ethers'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        address: {
          label: 'Address',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials) {
        if (Boolean(utils.getAddress(credentials?.address!))) {
          return null
        }
        return {
          id: credentials?.address,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async session({ session, token }) {
      session.address = token.sub
      return session
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
    newUser: '/',
  },
})
`}
        </Snippet>
        <Text>Doing this will allow us to login users with a session:</Text>
        <Snippet>{`// NextAuth.js signIn will help us create a session
import { signIn } from 'next-auth/react'
// hooks that allow to use metamask informations
import { useConnect, useAccount } from 'wagmi'

Function Login(){
  const [{ data: connectData }, connect] = useConnect()
  const [{ data: accountData }] = useAccount()

  const handleLogin = async () => {
    try {
      const callbackUrl = '/protected'
      if (accountData?.address) {
        signIn('credentials', { address: accountData.address, callbackUrl })
        return
      }
      const { data, error } = await connect(connectData.connectors[0])
      if (error) {
        throw error
      }
      signIn('credentials', { address: data?.account, callbackUrl })
    } catch (error) {
      window.alert(error)
    }
  }
  ... rest of your component
`}</Snippet>

        {metamaskInstalled ? (
          <>
            <Text>Try it by logging in!</Text>
            <Button onClick={handleLogin}>Login</Button>
          </>
        ) : (
          <>
            <Text>
              {' '}
              Please install{' '}
              <Link href="https://metamask.io/" target="_blank">
                Metamask
              </Link>{' '}
              to use this example.
            </Text>
          </>
        )}
      </section>

      <hr className="border-t border-accents-2 my-6" />
    </Page>
  )
}

Home.Layout = Layout

export default Home
