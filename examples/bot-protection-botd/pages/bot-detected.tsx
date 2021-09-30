import Link from 'next/link'
import { Headers, Page, Code } from '@components'
import BotdResult from '@components/botd-result'

export default function BotDetected() {
  return (
    <Page>
      <h1>Bot Protection with Botd (by FingerprintJS)</h1>
      <p>
        After doing light bot detection, we have detected that you are a bot!
      </p>
      <p>Navigate to other routes:</p>
      <ul>
        <li>
          <Link href="/">
            <a>Home page using Botd</a>
          </Link>
        </li>
        <li>
          <Link href="/omit">
            <a>Without Botd</a>
          </Link>
        </li>
      </ul>
      <hr />
      <p>Below is a fetch for this page:</p>
      <Headers path="/blocked" />
      <p>
        Below is the result of doing full bot protection by calling the{' '}
        <Code>/detect</Code> endpoint from Botd after changing the{' '}
        <Code>userAgent</Code> to a headless browser:
      </p>
      <BotdResult isBot />
    </Page>
  )
}
