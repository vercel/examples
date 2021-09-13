import { useEffect } from 'react'
import Link from 'next/link'
import { SPLITS, track } from '@lib/split'
import { Page, Code } from '@components'

export default function About() {
  useEffect(() => {
    track(SPLITS.NEW_ABOUT_PAGE, 'user', 'page_serve', null, {
      treatment: 'on',
    }).catch((error) => {
      console.error(
        'Request to Split blocked, probably because by an add blocker',
        error
      )
    })
  }, [])

  return (
    <Page>
      <h1>About Variant</h1>
      <h2>
        You're currently looking at the variant of the about page under{' '}
        <Code>pages/about/b.tsx</Code>
      </h2>
      <Link href="/">
        <a>Go back to /</a>
      </Link>
    </Page>
  )
}
