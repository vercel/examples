import Link from 'next/link'
import { Code, Page, Headers } from '@components'

export default function Index() {
  return (
    <Page>
      <h1>Bot Protection with DataDome</h1>
      <h3>This page has DataDome enabled, and you're not a bad bot.</h3>
      <p>Navigate to other routes:</p>
      <ul>
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
        <li>
          <Link href="/blocked">
            <a>Behind captcha</a>
          </Link>
        </li>
      </ul>
      <hr />
      <p>
        Below is a fetch for this page and to a page without DataDome enabled
      </p>
      <Headers path="/" />
      <Headers path="/omit" />
      <p>
        By checking the request to this page in the network tab in devtools,
        you'll be able to see how is latency affected by DataDome after looking
        at the headers.
      </p>
    </Page>
  )
}
