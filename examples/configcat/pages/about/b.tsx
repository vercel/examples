import Link from 'next/link'
import { Code } from '@components'
import ConfigcatLayout from '@components/layout'

export default function About() {
  return (
    <>
      <h1>About Variant</h1>
      <h2>
        You're currently looking at the variant of the about page under{' '}
        <Code>pages/about/b.tsx</Code>
      </h2>
      <Link href="/">
        <a>Go back to /</a>
      </Link>
    </>
  )
}

About.Layout = ConfigcatLayout
