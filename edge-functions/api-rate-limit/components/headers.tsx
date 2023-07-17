import { useState, FC } from 'react'
import { Button } from '@vercel/examples-ui'

const Headers: FC<{ path: string; children: string }> = ({
  path,
  children,
}) => {
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState<any>({
    path,
    latency: null,
    status: null,
    headers: {
      'X-RateLimit-Limit': '',
      'X-RateLimit-Remaining': '',
      'X-RateLimit-Reset': '',
    },
    data: null,
  })
  const handleFetch = async () => {
    const start = Date.now()
    setLoading(true)

    try {
      const res = await fetch(path)
      setState({
        path,
        latency: `~${Math.round(Date.now() - start)}ms`,
        status: `${res.status}`,
        headers: {
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
    <div className="mb-4">
      <Button variant="secondary" className="mb-2" onClick={handleFetch}>
        {children}
      </Button>
      <pre
        className={`border border-accents-2 rounded-md bg-white overflow-x-auto p-6 transition-all ${
          loading ? ` opacity-50` : ''
        }`}
      >
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  )
}

export default Headers
