import Head from 'next/head'
import { Layout, Text, Page, Button, Link } from '@vercel/examples-ui'
import { Snippet } from '../components/Snippet'

import { signIn } from 'next-auth/react'
import { useConnect, useAccount } from 'wagmi'

function Home() {
  const [{ data: connectData }, connect] = useConnect()
  const [{ data: accountData }] = useAccount()

  const handleLogin = async () => {
    const callbackUrl = '/protected'
    if (accountData?.address) {
      signIn('credentials', { address: accountData.address, callbackUrl })
      return
    }
    const { data } = await connect(connectData.connectors[0])

    signIn('credentials', { address: data?.account, callbackUrl })
  }

  return (
    <Page>
      <Head>
        <title>Web3 Session Example</title>
        <meta
          name="description"
          content="Vercel example how to use web3-sessions"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col space-y-4 gap-6">
        <Text variant="h1">Web3 Session Example</Text>
        <Text>
          In a decentralized application, a user is often identifies by a
          Cryptocurrency wallet such as{' '}
          <Link href="https://metamask.io/" target="_blank">
            Metamask
          </Link>
          . However, since Metamask works by injecting a script into the page,
          it is only available on the client, cutting off the ability to use
          `getServerSideProps` to fetch user data.
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
          . We will need to configure NextAuth.js with the
          `CredentialsProvider`:
        </Text>
        <Snippet>
          {`
import NextAuth from 'next-auth'
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
        <Text>Doing this will allow us to login users with a session</Text>
        <Snippet>{`
// NextAuth.js signIn will help us create a session
import { signIn } from 'next-auth/react'
// hooks that allow to use metamask informations
import { useConnect, useAccount } from 'wagmi' 

Function Login(){ 
  const [{ data: connectData }, connect] = useConnect()
  const [{ data: accountData }] = useAccount()

  const handleLogin = async () => {
    const callbackUrl = '/protected'
    // if we detect a previous metamask connection we create the session
    if (accountData?.address) {
      signIn('credentials', { address: accountData.address, callbackUrl })
      return
    }
    // otherwise we connect to the first available connector
    const { data } = await connect(connectData.connectors[0])

    signIn('credentials', { address: data?.account, callbackUrl })
  }
  ... rest of your component

`}</Snippet>
        Try it by logging in! (Metamask should be installed)
        <Button onClick={handleLogin}>Login</Button>
      </section>

      <hr className="border-t border-accents-2 my-6" />
    </Page>
  )
}

Home.Layout = Layout

export default Home
