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
        <ClearButton
          label="Remove /about cookie & reload"
          cookieName="flag-about"
        />
        <ClearButton
          label="Remove /marketing cookie & reload"
          cookieName="flag-marketing"
        />
      </div>
    </Page>
  )
}

function ClearButton({
  label,
  cookieName,
}: {
  label: string
  cookieName: string
}) {
  'use client'

  const removeCookie = (name: string) => {
    Cookies.remove(name)
    window.location.reload()
  }

  return (
    <Button
      variant="secondary"
      className="mr-2.5"
      onClick={() => removeCookie(cookieName)}
    >
      {label}
    </Button>
  )
}
