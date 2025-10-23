'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
  const { data, error } = useSWR('/api/node?id=A', fetcher)

  if (error) {
    return <div>Failed to load node</div>
  }
  if (!data) {
    return <div>Loading...</div>
  }
  return <div>Node: {JSON.stringify(data)}</div>
}
