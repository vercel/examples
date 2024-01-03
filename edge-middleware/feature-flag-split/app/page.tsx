'use client'
import { Button, List, Page, Text, Link } from '@vercel/examples-ui'
import Cookies from 'js-cookie'

export default function Index() {
  return (
    <Page>
      <Text variant="h2" className="mb-6">
        AB testing with Split
      </Text>
      <Text className="mb-4">
        The about and marketing pages will each render a different version with
        a 50% chance:
      </Text>
      <List className="mb-4">
        <li>
          <Link href="/about">/about</Link>
        </li>
        <li>
          <Link href="/marketing">/marketing</Link>
        </li>
      </List>
      <Text className="text-lg mb-4">
        Click the buttons below if you want to change the current variant (each
        variant has a 50% chance)
      </Text>
      <div>
        <CookieButton userKey="Joe" />
        <CookieButton userKey="Bobby" />
      </div>
    </Page>
  )
}

function CookieButton({ userKey }: { userKey: string }) {
  'use client'

  const removeCookie = (name: string) => {
    Cookies.set('split-userkey', userKey)
    window.location.reload()
  }

  return (
    <Button
      variant="secondary"
      className="mr-2.5"
      onClick={() => removeCookie('split-userkey')}
    >
      Authenticate as {userKey} and reload page
    </Button>
  )
}
