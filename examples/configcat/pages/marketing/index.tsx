import Link from 'next/link'
import { Page } from '@components'

export default function Marketing() {
  return (
    <Page>
      <h1>Marketing page</h1>
      <h2>This is the original marketing page</h2>
      <p>
        You're currently on <b>/marketing</b>
      </p>
      <Link href="/">
        <a>Go back to /</a>
      </Link>
    </Page>
  )
}
