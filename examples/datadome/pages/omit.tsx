import Link from 'next/link';
import { Code, Page, Headers } from '@components';

export default function Omit() {
  return (
    <Page>
      <h1>Bot Protection with DataDome</h1>
      <h3>This page is not using DataDome.</h3>
      <ul>
        <li>
          <Link href="/">
            <a>Use DataDome</a>
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
      <Headers path="/omit" />
      <p>
        This should give an overall idea of how TTFB is affected by DataDome
      </p>
    </Page>
  );
}
