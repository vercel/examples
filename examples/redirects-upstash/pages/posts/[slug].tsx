import { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/dist/client/router'
import { A, Code } from '@components'

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

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
    <div className="h-screen text-primary font-medium p-4 grid items-center justify-center">
      <div className="grid justify-items-center">
        <h1 className="text-8xl mb-4">#{slug.padStart(5, '0')}</h1>
        <p>
          latency: <Code>{latency}ms</Code>
        </p>
        <p>
          <A href="/">Home</A>
          {links.map((n) => (
            <Fragment key={n}>
              | <A href={`/${n}`}>/{n}</A>
            </Fragment>
          ))}
        </p>
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  // Simulate a large amount of paths
  return {
    paths: Array.from({ length: 10000 }, (x, i) => `/posts/${i + 1}`),
    fallback: false,
  }
}

export async function getStaticProps() {
  // Data fetching for each path, in this simple example we won't do anything
  return { props: {} }
}
