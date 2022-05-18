import {
  Layout,
  Text,
  Page,
  Link,
  Code,
  Snippet,
  Button,
} from '@vercel/examples-ui'
import { getCsrfToken, signIn, useSession, signOut } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi'

function Home() {
  const session = useSession()

  const [{ data: connectData }, connect] = useConnect()
  const [, signMessage] = useSignMessage()
  const [{ data: networkData }] = useNetwork()
  const [{ data: accountData }] = useAccount()

  const handleLogin = async () => {
    try {
      await connect(connectData.connectors[0])
      const callbackUrl = '/protected'
      const message = new SiweMessage({
        domain: window.location.host,
        address: accountData?.address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: networkData?.chain?.id,
        nonce: await getCsrfToken(),
      })
      const { data: signature, error } = await signMessage({
        message: message.prepareMessage(),
      })
      signIn('credentials', {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      })
    } catch (error) {
      window.alert(error)
    }
  }

  const handleLogout = async () => {
    signOut({ redirect: false })
  }

  const ethereumPresent = typeof window !== 'undefined' && !!window.ethereum

  return (
    <Page>
      <section className="flex flex-col gap-6">
        <Text variant="h1">Web3 Authentication</Text>
        <Text>
          This example shows how to implement Web3 authentication using{' '}
          <Link href="https://next-auth.js.org/">NextAuth.js</Link>,{' '}
          <Link href="https://github.com/tmm/wagmi">Wagmi</Link> and{' '}
          <Link href="https://www.npmjs.com/package/siwe">SIWE</Link>. The
          Sign-In With Ethereum is a pattern aimed at standardizing the way
          sessions are handled when connecting a cryptocurrency wallet to an
          application.
        </Text>
        <Text>
          Following this pattern in Next.js helps us build our application using
          the full capacities of Next.js as we now have access to users wallet
          both in the browser and on the server.
        </Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        {!ethereumPresent && (
          <Link href="https://metamask.io/" target="_parent">
            Please install Metamask to use this example
          </Link>
        )}
        <Button
          onClick={
            session.status === 'authenticated' ? handleLogout : handleLogin
          }
        >
          {session.status === 'authenticated' ? 'Logout' : 'Login'}
        </Button>
        <Text>
          {session.status === 'authenticated'
            ? `Connected as ${session.data?.user?.name}`
            : `Not connected`}
        </Text>
        <Text variant="h2">Login</Text>
        <Text>
          We&apos;ll be using <Code>NextAuth.js</Code> to save the user session
          in a JWT. In order to do so, we&apos;ll have to configure NextAuth.js:
        </Text>

        <Snippet>{`// pages/api/auth/[...nextauth].ts

import type { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getCsrfToken } from 'next-auth/react'
import { SiweMessage } from 'siwe'

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const providers = [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials) {
        try {
          if (!process.env.NEXTAUTH_URL) {
            throw 'NEXTAUTH_URL is not set'
          }
          // the siwe message follows a predictable format
          const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'))
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL)
          if (siwe.domain !== nextAuthUrl.host) {
            return null
          }
          // validate the nonce
          if (siwe.nonce !== (await getCsrfToken({ req }))) {
            return null
          }
          // siwe will validate that the message is signed by the address 
          await siwe.validate(credentials?.signature || '')
          return {
            id: siwe.address,
          }
        } catch (e) {
          return null
        }
      },
    }),
  ]

  const isDefaultSigninPage =
    req.method === 'GET' && req.query.nextauth.includes('signin')

  if (isDefaultSigninPage) {
    providers.pop()
  }

  return await NextAuth(req, res, {
    providers,
    session: {
      strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      // after a user is logged in, we can keep the address in session
      async session({ session, token }) {
        session.address = token.sub
        session.user!.name = token.sub
        return session
      },
    },
  })
}`}</Snippet>

        <Text>This will give us access to implementing our login function</Text>
        <Snippet>
          {`import { getCsrfToken, signIn, useSession, signOut } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi'

function Home() {
  // contains the JWT session from NextAuth.js
  const session = useSession()

  // Wagmi hooks to interact with Metamask
  const [{ data: connectData }, connect] = useConnect()
  const [, signMessage] = useSignMessage()
  const [{ data: networkData }] = useNetwork()
  const [{ data: accountData }] = useAccount()

  const handleLogin = async () => {
    try {
      await connect(connectData.connectors[0])
      const callbackUrl = '/protected'
      const message = new SiweMessage({
        domain: window.location.host,
        address: accountData?.address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: networkData?.chain?.id,
        nonce: await getCsrfToken(),
      })
      const { data: signature, error } = await signMessage({
        message: message.prepareMessage(),
      })
      signIn('credentials', {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      })
    } catch (error) {
      window.alert(error)
    }
  }

  const handleLogout = async () => {
    signOut({ redirect: false })
  }`}
        </Snippet>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
