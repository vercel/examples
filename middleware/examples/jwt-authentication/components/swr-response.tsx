import type { FC } from 'react'
import useSWR from 'swr'

async function fetcher(url: string) {
  const start = performance.now()
  const res = await fetch(url)
  const latency = `~${Math.round(performance.now() - start)}ms`
  const data = await res.json()

  return { url, latency, status: res.status, data }
}

const SwrResponse: FC<{ url: string }> = ({ url }) => {
  const { data } = useSWR(url, fetcher)

  return (
    <pre className={`overflow-x-auto p-6${!data ? ' opacity-50' : ''}`}>
      {JSON.stringify(
        data
          ? data
          : {
              url,
              latency: null,
              status: null,
              data: { nanoid: null, jwtID: null },
            },
        null,
        2
      )}
    </pre>
  )
}

export default SwrResponse
