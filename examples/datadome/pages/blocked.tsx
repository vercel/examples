import Link from 'next/link'
import Cookies from 'js-cookie'
import { Button, Code, Headers, Page } from '@components'

export default function Blocked() {
  const removeCookie = () => {
    Cookies.remove('datadome')
  }

  return (
    <Page>
      <h1>Bot Protection with DataDome</h1>
      <h3>
        This page should ask you for captcha once, future refreshes or
        navigations to this page won't ask you again, unless the{' '}
        <Code>datadome</Code> cookie is removed
      </h3>
      <Button onClick={removeCookie}>Remove datadome cookie</Button>
      <p>Navigate to other routes:</p>
      <ul>
        <li>
          <Link href="/">
            <a>Home page using DataDome</a>
          </Link>
        </li>
        <li>
          <Link href="/omit">
            <a>Without DataDome</a>
          </Link>
        </li>
        <li>
          <Link href="/no-connection">
            <a>
              DataDome and <Code>Connection: 'close'</Code>
            </a>
          </Link>
        </li>
      </ul>
      <hr />
      <p>Below is a fetch for this page</p>
      <Headers path="/blocked" />
    </Page>
  )
}
