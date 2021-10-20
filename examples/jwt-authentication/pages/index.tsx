import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Layout, Text, Link, Code } from '@edge-functions/ui'
import { USER_TOKEN } from '@lib/constants'
import SwrResponse from '@components/swr-response'

const sampleFetch = `await fetch('/api?edge')
await fetch('/api')`

function Index() {
  const [token, setToken] = useState(Cookies.get('token'))

  useEffect(() => {
    setToken(Cookies.get(USER_TOKEN))
  }, [])

  return (
    <div className="w-full max-w-3xl mx-auto pt-16 mb-4">
      <div className="text-center mb-6">
        <Text variant="h1" className="mb-4">
          JWT Authentication
        </Text>
        <Text className="mb-4">
          With <i className="font-semibold">Vercel's Edge Middleware</i> we're
          able to authenticate users with JWT tokens before they hit any
          endpoints, and even to respond directly from the edge.
        </Text>
      </div>

      <div className="mb-6">
        <Text className="mb-4 text-center">
          Below is your assigned user token (a JWT), saved under the
          <Code>{USER_TOKEN}</Code> cookie
        </Text>
        <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 mb-2">
          {token}
        </pre>
      </div>

      <div className="mb-6">
        <Text className="mb-4 text-center">
          We'll make a request to <Link href="/api">/api</Link> and{' '}
          <Link href="/api?edge">/api?edge</Link> using your token, where the
          first will hit an API route and the latter will be handled by the
          edge, they'll return a <Code>nanoid</Code>
        </Text>
        <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 mb-2">
          {sampleFetch}
        </pre>
      </div>

      <Text className="mb-4 text-center">
        Below is the result of making a request to both the edge and the API
        endpoint:
      </Text>
      <div className="mb-6 border border-accents-2 rounded-md divide-y divide-accents-2">
        <SwrResponse url="/api?edge" />
        <SwrResponse url="/api" />
      </div>

      <Text className="mb-6 text-center">
        The latency shown might not be realistic, check the network tab in
        devtools and filter by <Code>/api</Code> for better results.
      </Text>
    </div>
  )
}

Index.Layout = Layout

export default Index
