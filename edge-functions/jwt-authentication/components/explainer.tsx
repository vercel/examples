import { invalidateAuth, requestAuth } from '@lib/auth'
import { USER_TOKEN } from '@lib/constants'
import { Layout, Page, Text, Code, Link, Button } from '@vercel/examples-ui'
import { useRouter } from 'next/router'

export default function Explainer() {
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

      <div className="mb-6">
        <Text className="mb-4 ">
          Your assigned token is a JWT saved under the <Code>{USER_TOKEN}</Code>{' '}
          cookie. You are currently on page: <Code>{pathname}</Code>
        </Text>
        <div className="space-x-4">
          <Link href="/">Home page</Link>
          <Link href="/protected">Protected page</Link>
        </div>
      </div>

      <div className="mb-6">
        <Text className="mb-4">
          If you take an action that requires you to be authenticated,
          Middleware will redirect you to the home page.
        </Text>
      </div>

      <div className="space-x-4">
        <Button onClick={requestAuth}>Get a token</Button>
        <Button onClick={invalidateAuth}>Expire token</Button>
      </div>
    </Page>
  )
}
