import Link from 'next/link'
import { Code, Page, Headers } from '@components'
import BotdResult from '@components/botd-result'

export default function Index() {
  return (
    <Page>
      <h1>Bot Protection with Botd (by FingerprintJS)</h1>
      <p>
        This page has Botd enabled. The edge does light bot detection by making
        a request to the <Code>/edge</Code> endpoint from Botd.
      </p>
      <p>Navigate to other routes:</p>
      <ul>
        <li>
          <Link href="/omit">
            <a>Without Botd</a>
          </Link>
        </li>
        <li>
          <Link href="/blocked">
            <a>Page with Bot Detected</a>
          </Link>
        </li>
      </ul>
      <hr />
      <p>Below is a fetch for this page and to a page without Botd enabled:</p>
      <Headers path="/" />
      <Headers path="/omit" />
      <p>
        By checking the request to this page in the network tab in devtools,
        you'll be able to see how is latency affected by Botd after looking at
        the headers.
      </p>
      <p>
        After the page loads, we load the botd script and then we can start
        doing full bot protection by calling the <Code>/detect</Code> endpoint.
        You can see the result from Botd below:
      </p>
      <BotdResult />
    </Page>
  )
}
