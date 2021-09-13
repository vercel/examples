import Link from 'next/link'
import { Code, Headers, Page } from '@components'

export default function NoConnection() {
  return (
    <Page>
      <h1>Bot Protection with DataDome</h1>
      <h3>This page is using DataDome but the connection is closed.</h3>
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
          <Link href="/blocked">
            <a>Behind captcha</a>
          </Link>
        </li>
      </ul>
      <hr />
      <p>Below is a fetch for this page</p>
      <Headers path="/no-connection" />
      <p>
        You should expect a higher latency for every request if the Edge does
        not keep the connection alive with DataDome
      </p>
    </Page>
  )
}
