import { useEffect } from 'react'
import Link from 'next/link'
import { SPLITS, track } from '@lib/split'
import { Page } from '@components'

export default function Marketing() {
  useEffect(() => {
    track(SPLITS.NEW_ABOUT_PAGE, 'user', 'page_serve', null, {
      treatment: 'off',
    }).catch((error) => {
      console.error(
        'Request to Split blocked, probably because by an add blocker',
        error
      )
    })
  }, [])

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
