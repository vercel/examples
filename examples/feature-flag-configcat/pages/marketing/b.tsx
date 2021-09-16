import Link from 'next/link'
import { Code } from '@components'
import ConfigcatLayout from '@components/layout'

export default function Marketing() {
  return (
    <>
      <h1>Marketing Variant</h1>
      <h2>
        You're currently looking at the variant of the marketing page under{' '}
        <Code>pages/marketing/b.tsx</Code>
      </h2>
      <Link href="/">
        <a>Go back to /</a>
      </Link>
    </>
  )
}

Marketing.Layout = ConfigcatLayout
