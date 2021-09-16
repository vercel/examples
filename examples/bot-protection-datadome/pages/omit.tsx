import Link from 'next/link'
import { Code, Page, Headers } from '@components'

export default function Omit() {
  return (
    <Page>
      <h1>Bot Protection with DataDome</h1>
      <h3>This page is not using DataDome.</h3>
      <p>Navigate to other routes:</p>
      <ul>
        <li>
          <Link href="/">
            <a>Home page using DataDome</a>
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
      <Headers path="/omit" />
    </Page>
  )
}
