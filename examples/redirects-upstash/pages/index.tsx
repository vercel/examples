import { A, Code } from '@components'

export default function Index() {
  return (
    <div className="h-screen text-primary font-medium p-4 grid items-center justify-center">
      <div className="max-w-lg">
        <h1 className="text-6xl font-bold mb-12">Edge Redirects</h1>
        <p>
          This demo will redirect any path from <A href="/1">/1</A> -{' '}
          <A href="/10000">/10000</A> to <Code>/posts/1</Code> -{' '}
          <Code>/posts/10000</Code>
        </p>
        <p className="my-6">
          The redirects are hardcoded on a JSON for the paths{' '}
          <Code>/1 - /1000</Code>, and coming from Redis (
          <A href="https://upstash.com/">Upstash</A>) for the next{' '}
          <Code>1001 - 10000</Code> paths
        </p>
        <p>
          Every route returns a latency (added as a query param) which should
          give you an idea of how the performance of reading a JSON differs from
          Redis
        </p>
      </div>
    </div>
  )
}
