import { FC, useState } from 'react'
import { Button, Text } from '@vercel/examples-ui'

function fetchDemo(key: string) {
  if (!key) return `const res = await fetch('/api/ping')`
  return `const res = await fetch('/api/ping', {
  headers: {
    Authorization: 'Bearer ${key}'
  }
})`
}
const ApiRequest: FC<{ token: string }> = ({ token }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [state, setState] = useState<any>({
    latency: null,
    status: null,
    headers: {
      'X-upstash-latency': '',
      'X-RateLimit-Limit': '',
      'X-RateLimit-Remaining': '',
      'X-RateLimit-Reset': '',
    },
    data: { done: false },
  })
  const handleFetch = async () => {
    const start = Date.now()
    setLoading(true)

    try {
      const res = await fetch(
        '/api/ping',
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      )
      setState({
        latency: `~${Math.round(Date.now() - start)}ms`,
        status: `${res.status}`,
        headers: {
          'X-upstash-latency': `${res.headers.get('X-upstash-latency')}ms`,
          'X-RateLimit-Limit': res.headers.get('X-RateLimit-Limit'),
          'X-RateLimit-Remaining': res.headers.get('x-RateLimit-Remaining'),
          'X-RateLimit-Reset': res.headers.get('x-RateLimit-Reset'),
        },
        data: res.headers.get('Content-Type')?.includes('application/json')
          ? await res.json()
          : null,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid">
      <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 mb-2">
        {fetchDemo(token)}
      </pre>
      <pre
        className={`border-accents-2 border rounded-md bg-white overflow-x-auto p-6 mb-4 transition-all${
          loading ? ' opacity-50' : ''
        }`}
      >
        {JSON.stringify(state, null, 2)}
      </pre>
      <div className="grid gap-4 items-center justify-center sm:justify-between sm:grid-flow-col">
        <Text className="my-4 text-center">
          You can select an API token from the list below to use it in the
          request
        </Text>
        <Button
          variant="black"
          type="button"
          className="sm:w-40"
          onClick={handleFetch}
          loading={loading}
        >
          Make a request
        </Button>
      </div>
    </div>
  )
}

export default ApiRequest
