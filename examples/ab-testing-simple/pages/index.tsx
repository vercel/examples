import Link from 'next/link'
import { Page } from '../components'

export default function Index() {
  return (
    <Page>
      <h1>AB testing with buckets</h1>
      <p>
        In this demo we use cookies to assign a bucket with the variant to show.
        Visit one of the pages below and a bucket will be assigned to you.
      </p>
      <ul>
        <li>
          <Link href="/home">
            <a>/home</a>
          </Link>
        </li>
        <li>
          <Link href="/marketing">
            <a>/marketing</a>
          </Link>
        </li>
      </ul>
    </Page>
  )
}
