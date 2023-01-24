import { useState, useEffect } from 'react'

export default function Headers({ path }: { path: string }) {
  const [loading, setLoading] = useState<boolean>(false)
  const [latency, setLatency] = useState(0)
  const [headers, setHeaders] = useState({
    'x-datadome': 'loading...',
    'x-datadome-latency': 'loading...',
  })

  useEffect(() => {
    const start = Date.now()
    setLoading(true)
    fetch(path, { method: 'HEAD' })
      .then((res) => {
        if (res.ok) {
          setLatency(Math.round(Date.now() - start))
          setHeaders({
            'x-datadome': res.headers.get('x-datadome')!,
            'x-datadome-latency': res.headers.get('x-datadome-latency')!,
          })
        }
      })
      .finally(() => setLoading(false))
  }, [path])

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
