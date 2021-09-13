import Link from 'next/link'
import Cookies from 'js-cookie'
import { SPLITS } from '@lib/split'
import { Page, Button } from '@components'

export default function Index() {
  const removeCookie = (name: string) => {
    Cookies.remove(name)
    window.location.reload()
  }

  return (
    <Page>
      <h1>AB testing with Split</h1>
      <p>
        The about and marketing pages will each render a different version with
        a 50% chance:
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
        Click the buttons below if you want to change the current variant (each
        variant has a 50% chance)
      </p>
      <Button
        onClick={() => removeCookie(`flag-${SPLITS.NEW_ABOUT_PAGE}`)}
        style={{ marginRight: '0.625rem' }}
      >
        Remove /about cookie & reload
      </Button>
      <Button onClick={() => removeCookie(`flag-${SPLITS.NEW_MARKETING_PAGE}`)}>
        Remove /marketing cookie & reload
      </Button>
    </Page>
  )
}
