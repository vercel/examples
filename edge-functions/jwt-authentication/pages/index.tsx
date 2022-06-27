import { Layout } from '@vercel/examples-ui'
import { Page, Text, Code, Link, Button } from '@vercel/examples-ui'
import { USER_TOKEN } from '@lib/constants'

export default function Index() {
  return (
    <Page>
      <Text variant="h1" className="mb-6">
        JWT Authentication
      </Text>
      <Text className="mb-4">
        With <i className="font-semibold">Vercel&apos;s Edge Middleware</i>{' '}
        we&apos;re able to authenticate users before they hit your app.
      </Text>
      <Text className="mb-4">
        Authentication is managed with a{' '}
        <Link href="https://jwt.io/" target="_blank" rel="noreferrer">
          JWT
        </Link>{' '}
        saved under the <Code>{USER_TOKEN}</Code> cookie.
      </Text>
      <Text className="mb-4">
        If you visit <Link href="/protected">/protected</Link> if will redirect
        you here if you aren&apos;t authenticated. Click the button below to
        authenticate and be able to see the page:
      </Text>
      <div className="space-x-4 mt-2">
        <Button
          onClick={() => {
            fetch('/api/auth', { method: 'POST' })
          }}
        >
          Set the {USER_TOKEN} cookie
        </Button>
      </div>
    </Page>
  )
}

Index.Layout = Layout
