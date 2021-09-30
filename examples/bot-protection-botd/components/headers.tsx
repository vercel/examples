import { EDGE_RESULT_HEADERS } from '@lib/botd/constants'
import { useState, useEffect } from 'react'

export default function Headers({ path }: { path: string }) {
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
    fetch(path, { method: 'HEAD' }).then((res) => {
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
  }, [])

  return (
    <pre style={{ fontSize: '1rem' }}>
      {JSON.stringify({ path, latency: `~${latency}ms`, headers }, null, 2)}
    </pre>
  )
}
