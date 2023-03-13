import { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router'
import { Layout, Page, Text, Code, Link } from '@vercel/examples-ui'

export default function Slug() {
  const [links, setLinks] = useState([8000, 800])

  const router = useRouter()
  const slug = router.query.slug as string
  const latency = router.query.l ?? 0

  useEffect(() => {
    setLinks([
      Math.floor(Math.random() * 9000) + 1001,
      Math.floor(Math.random() * 1000) + 1,
    ])
  }, [router.asPath])

  return (
    <Page className="grid items-center justify-center">
      <div className="grid justify-items-center my-6 sm:my-20">
        <Text variant="h1" className="text-8xl mb-4">
          #{slug.padStart(5, '0')}
        </Text>
        <Text className="mb-2.5">
          latency: <Code>{latency}ms</Code>
        </Text>
        <Text>
          <Link href="/">Home </Link>
          {links.map((n) => (
            <Fragment key={n}>
              | <Link href={`/${n}`}>/{n} </Link>
            </Fragment>
          ))}
        </Text>
      </div>
    </Page>
  )
}

Slug.Layout = Layout

export async function getStaticPaths() {
  // Simulate a large amount of paths
  return {
    paths: Array.from({ length: 10000 }, (_, i) => `/posts/${i + 1}`),
    fallback: false,
  }
}

export async function getStaticProps() {
  // Data fetching for each path, in this simple example we won't do anything
  return { props: {} }
}
