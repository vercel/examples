import Link from 'next/link'
import { Page } from '@components'

export default function About() {
  return (
    <Page>
      <h1>About page</h1>
      <h2>This is the original about page</h2>
      <p>
        You're currently on <b>/about</b>
      </p>
      <Link href="/">
        <a>Go back to /</a>
      </Link>
    </Page>
  )
}
