import { useRouter } from 'next/dist/client/router'
import { Code } from '@components'

export default function Slug() {
  const router = useRouter()
  const slug = router.query.slug as string
  const latency = router.query.l

  return (
    <div className="h-screen text-primary font-medium p-4 grid items-center justify-center">
      <div className="grid justify-items-center">
        <h1 className="text-8xl">#{slug.padStart(5, '0')}</h1>
        <p>
          latency: <Code>{latency ?? 0}ms</Code>
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
