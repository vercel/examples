import Link from 'next/link';
import { Code, Page, Headers } from '@components';

export default function Index() {
  return (
    <Page>
      <h1>Bot Protection with DataDome</h1>
      <h3>This page has DataDome enabled, and you're not a bot.</h3>
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
          <Link href="/im-a-bot">
            <a>Simulation of bot</a>
          </Link>
        </li>
      </ul>
      <Headers path="/" />
      <p>
        By checking the request to this page in the network tab in devtools,
        you'll be able to see how is latency affected by DataDome after looking
        at the headers.
      </p>
    </Page>
  );
}
