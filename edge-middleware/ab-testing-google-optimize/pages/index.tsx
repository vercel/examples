import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Text, Code, Link, Button, List } from '@vercel/examples-ui'
import { COOKIE_NAME } from '@lib/constants'
import { useGa } from '@lib/useGa'
import OptimizeLayout from '@components/layout'

export default function Index() {
  const ga = useGa()
  const [cookie, setCookie] = useState('')
  const removeCookie = () => {
    Cookies.remove(COOKIE_NAME)
    window.location.reload()
  }

  useEffect(() => {
    setCookie(Cookies.get(COOKIE_NAME))
  }, [])

  useEffect(() => {
    if (ga && cookie) {
      ga('set', 'exp', cookie)
    }
    ga('send', 'pageview')
  }, [ga, cookie])

  return (
    <>
      <Text variant="h2" className="mb-6">
        AB testing with Google Optimize
      </Text>
      <Text className="mb-4">
        Once you load this page, there&apos;s a new <Code>{COOKIE_NAME}</Code>{' '}
        cookie set in the browser, it has the shape of{' '}
        <Code>{'${experimentId}.${variantId}'}</Code>. You&apos;re assigned to:{' '}
        <b>{cookie}</b>
      </Text>
      <Text className="mb-4">
        Based on a predefined experiment you&apos;ll be assigned one of 3
        variants (0, 1, 2), where 0 is the original page
      </Text>
      <Text className="mb-4">
        The about and marketing pages will render the version of the page that
        matches the variant:
      </Text>
      <List className="mb-4">
        <li>
          <Link href="/about">/about</Link>
        </li>
        <li>
          <Link href="/marketing">/marketing</Link>
        </li>
      </List>
      <Text className="mb-4">
        Click the button below if you want to change the current variant (each
        variant has a 33% chance)
      </Text>
      <Button variant="secondary" onClick={removeCookie}>
        Remove cookie & reload
      </Button>
    </>
  )
}

Index.Layout = OptimizeLayout
