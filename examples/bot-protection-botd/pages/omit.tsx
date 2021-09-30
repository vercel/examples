import Link from 'next/link'
import { Page, Headers } from '@components'

export default function Omit() {
  return (
    <Page>
      <h1>Bot Protection with Botd (by FingerprintJS)</h1>
      <p>This page is not using Botd.</p>
      <p>Navigate to other routes:</p>
      <ul>
        <li>
          <Link href="/">
            <a>Home page using Botd</a>
          </Link>
        </li>
        <li>
          <Link href="/blocked">
            <a>Page with Bot Detected</a>
          </Link>
        </li>
      </ul>
      <hr />
      <p>Below is a fetch for this page:</p>
      <Headers path="/omit" />
    </Page>
  )
}
