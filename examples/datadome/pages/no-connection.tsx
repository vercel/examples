import Link from 'next/link';
import { Code, Headers, Page } from '@components';

export default function NoConnection() {
  return (
    <Page>
      <h1>Bot Protection with DataDome</h1>
      <h3>This page is using DataDome but the connection is closed.</h3>
      <ul>
        <li>
          <Link href="/omit">
            <a>Without DataDome</a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a>Use DataDome and keep the connection alive</a>
          </Link>
        </li>
        <li>
          <Link href="/im-a-bot">
            <a>Simulation of bot</a>
          </Link>
        </li>
      </ul>
      <Headers path="/no-connection" />
      <p>
        You should expect a higher latency for every request if the Edge does
        not keep the connection alive with DataDome
      </p>
    </Page>
  );
}
