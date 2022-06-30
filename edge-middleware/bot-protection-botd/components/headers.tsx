import { useState, useEffect } from 'react'
import { EDGE_RESULT_HEADERS } from '@lib/botd/constants'

export default function Headers({ path }: { path: string }) {
  const [loading, setLoading] = useState(false)
  const [latency, setLatency] = useState(0)
  const [headers, setHeaders] = useState({
    'x-botd-latency': 'loading...',
    ...EDGE_RESULT_HEADERS.reduce(
      (obj, header) => Object.assign(obj, { [header]: 'loading...' }),
      {}
    ),
  })

  useEffect(() => {
    const start = Date.now()
    setLoading(true)
    fetch(path, { method: 'HEAD' })
      .then((res) => {
        if (res.ok) {
          setLatency(Math.round(Date.now() - start))
          setHeaders({
            'x-botd-latency': res.headers.get('x-botd-latency')!,
            ...EDGE_RESULT_HEADERS.reduce(
              (obj, header) =>
                Object.assign(obj, { [header]: res.headers.get(header) }),
              {}
            ),
          })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <pre
      className={`border-accents-2 border rounded-md bg-white overflow-x-auto p-6 mb-4 transition-all${
        loading ? ' opacity-50' : ''
      }`}
    >
      {JSON.stringify({ path, latency: `~${latency}ms`, headers }, null, 2)}
    </pre>
  )
}
