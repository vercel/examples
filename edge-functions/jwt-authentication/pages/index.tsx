import { Layout } from '@vercel/examples-ui'
import { useRouter } from 'next/router'
import { Page, Text, Code, Link, Button } from '@vercel/examples-ui'

import { invalidateAuth, requestAuth } from '@lib/auth'
import { USER_TOKEN } from '@lib/constants'

export default function Index() {
  const { pathname } = useRouter()
  return (
    <Page>
      <div className="text-center mb-6">
        <Text variant="h1" className="mb-4">
          JWT Authentication
        </Text>
        <Text className="mb-4">
          With <i className="font-semibold">Vercel&apos;s Edge Middleware</i>{' '}
          we&apos;re able to authenticate users with JWT tokens before they hit
          any endpoints or page
        </Text>
      </div>

      <section className="mspace-y-6">
        <Text className="mb-4 ">
          Your assigned token is a JWT saved under the <Code>{USER_TOKEN}</Code>{' '}
          cookie. You are currently on page: <Code>{pathname}</Code>. This page
          is not protected by the JWT.
        </Text>
        <Text>
          Visiting the protected page, will trigger a middleware that will
          redirect you here if you don&quot;t have a cookie.
        </Text>
        <div className="space-x-4 mt-2">
          <Link href="/protected">
            Visit <Code>/protected</Code> page
          </Link>

          <Button onClick={requestAuth}>Get a token</Button>
        </div>
      </section>
    </Page>
  )
}

Index.Layout = Layout
