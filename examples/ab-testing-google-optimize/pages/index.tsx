import { useEffect, useState } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { COOKIE_NAME } from '@lib/constants'
import { useGa } from '@lib/useGa'
import { Button, Code } from '@components'
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
      <h1>AB testing with Google Optimize</h1>
      <p>
        Once you load this page, there's a new <Code>{COOKIE_NAME}</Code> cookie
        set in the browser, it has the shape of{' '}
        <Code>{'${experimentId}.${variantId}'}</Code>. You're assigned to:{' '}
        <b>{cookie}</b>
      </p>
      <p>
        Based on a predefined experiment you'll be assigned one of 3 variants
        (0, 1, 2), where 0 is the original page
      </p>
      <p>
        The about and marketing pages will render the version of the page that
        matches the variant:
      </p>
      <ul>
        <li>
          <Link href="/about">
            <a>/about</a>
          </Link>
        </li>
        <li>
          <Link href="/marketing">
            <a>/marketing</a>
          </Link>
        </li>
      </ul>
      <p>
        Click the button below if you want to change the current variant (each
        variant has a 33% chance)
      </p>
      <Button onClick={removeCookie}>Remove cookie & reload</Button>
    </>
  )
}

Index.Layout = OptimizeLayout
